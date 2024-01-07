import requests
import xml.etree.ElementTree as ET
import json
import sys
import os

# Spremenljivka za exit code (v primeru napake ne ničelna, v primeru uspeha ničelna)
exitcode = 0
"""
# USPEH
0 - uspesno izveden program

# NEMOGOČI NEUSPEHI
1 - Nemogoča napaka v child (razen če (kar bodo prej ali slej) updatajo strukturo podatkov)
2 - Nemogoča napaka v child (razen če (kar bodo prej ali slej) updatajo strukturo podatkov)
3 - Nemogoča napaka v child2 (razen če (kar bodo prej ali slej) updatajo strukturo podatkov)
4 - Nemogoča napaka v child2 (razen če (kar bodo prej ali slej) updatajo strukturo podatkov)
5 - Nemogoča napaka v child2 (razen če (kar bodo prej ali slej) updatajo strukturo podatkov)

# POMEMBNI NEUSPEHI
6 - Podatki niso prišli iz poznanega vira
7 - Napaka se je zgodila na APIjevi strani (npr. model je zavrnil zaradi napačnega tipa)
8 - Napaka pri pošiljanju APIju (npr. ni konekcije)
"""

# URL od koder dobivamo podatke
ARSOXMLURL = "https://www.arso.gov.si/xml/zrak/ones_zrak_urni_podatki_zadnji.xml"

# Zaradi tega ker shranjujemo regije potrebujemo nek tuple ki matcha ime merilne postaje z njeno regijo
pairs = [("LJ Bežigrad", "Ljubljana"),("LJ Celovška", "Ljubljana"),("LJ Vič", "Ljubljana"),
         ("Kranj", "Kranj"),("MB Titova", "Maribor"),("MB Vrbanski", "Maribor"),("CE bolnica", "Celje"),
         ("CE Ljubljanska", "Celje"),("Ptuj", "Ptuj"),("MS Rakičan", "Murska Sobota"),("MS Cankarjeva", "Murska Sobota"),
         ("Solkan", "Nova Gorica"),("NG Grčna", "Nova Gorica"),("Otlica", "Ajdovščina"),("Koper", "Koper"),
         ("Trbovlje", "Trbovlje"),("Zagorje", "Zagorje ob Savi"),("Hrastnik", "Hrastnik"),("Novo mesto", "Novo mesto"),
         ("Iskrba", "Kočevje"),("Krvavec", "Kranj")] #21

# Kopiranje z interneta
r = requests.get(ARSOXMLURL, stream=True)

with open("lastaddition.xml", 'wb') as f:
    for chunk in r.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)

#Parsanje XML
tree = ET.parse('lastaddition.xml')
root = tree.getroot()

#x je glavni list dictionaryjev - tam se vse shrani
x = list()
#a je pomožni dictionary - tisti na katerem trenutno delam
a = {}
#Source pa reliability
source = None
reliability = None
#print("root tag: ", root.tag)
if(root.tag.find("arso")!=-1):
    source = "arso"
    reliability = 100
#worthless
#print("root attrib: ", root.attrib)
k=0
flag = False
for child in root:
    """
    if(child.text == None and child.attrib == {}):
        print("child tag: ", child.tag)
    elif(child.text == None and child.attrib != {}):
        print("child tag: ", child.tag, "child attrib: ", child.attrib)
    elif(child.attrib == {} and child.text != None):
        print("child tag: ", child.tag, "child text: ", child.text)
    else:
        print("child tag: ", child.tag, "child attrib: ", child.attrib, "child text: ", child.text)
    for child2 in child:
        if (child2.text == None and child2.attrib == {}):
            print("child2 tag: ", child2.tag)
        elif (child2.text == None and child2.attrib != {}):
            print("child2 tag: ", child2.tag, "child attrib: ", child2.attrib)
        elif (child2.attrib == {} and child2.text != None):
            print("child2 tag: ", child2.tag, "child text: ", child2.text)
        else:
            print("child2 tag: ", child2.tag, "child attrib: ", child2.attrib, "child text: ", child2.text)
    """
    if(source=="arso"):
        if (child.text == None and child.attrib == {}):
            print("NAPAKA1")
            exitcode = 1
        elif (child.text == None and child.attrib != {}):
            #print("child tag: ", child.tag, "child attrib: ", child.attrib)
            try:
                a["longtitude"] = child.attrib["ge_dolzina"]                #ge dolzina
                a["latitude"] = child.attrib["ge_sirina"]                   #ge sirina
            except:
                a["longtitude"] = 14.5
                a["latitude"] = 46.5
        elif (child.attrib == {} and child.text != None):
            if(child.tag=="vir"):
                continue
            elif(child.tag=="predlagan_zajem"):
                continue
            elif (child.tag == "predlagan_zajem_perioda"):
                continue
            elif (child.tag == "datum_priprave"):
                continue
            else:
                print("child tag: ", child.tag, "child text: ", child.text)
                print("NAPAKA2")
                exitcode = 2
                break
        else:
            a["longtitude"] = child.attrib[1]               # ge dolzina
            a["latitude"] = child.attrib[2]                 # ge sirina
            #print(child.tag, child.attrib, child.text)
        for child2 in child:
            if (child2.text == None and child2.attrib == {}):
                if (child2.tag == "pm10"):
                    a["PM10"] = None                        # pm10
                    continue
                elif (child2.tag == "pm2.5"):
                    a["PM2_5"] = child2.text                # pm2.5
                    continue
                elif (child2.tag == "so2"):
                    a["SO2"] = None                         # so2
                    continue
                elif (child2.tag == "co"):
                    a["CO"] = None                          # co THIS ONE MAY NOT WORK
                    continue
                elif (child2.tag == "o3"):
                    a["O3"] = None                          # o3
                    continue
                elif (child2.tag == "no2"):
                    a["NO2"] = None                         # no2
                    continue
                elif (child2.tag == "benzen"):
                    a["C6H6"] = None                        # benzen
                    continue
                print("child2 tag: ", child2.tag)
                print("NAPAKA3")
                exitcode = 3
                flag = True
                break
            elif (child2.text == None and child2.attrib != {}):
                print("child2 tag: ", child2.tag, "child attrib: ", child2.attrib)
                print("NAPAKA4")
                exitcode = 4
                flag = True
                break
            elif (child2.attrib == {} and child2.text != None):
                if(child2.tag=="merilno_mesto"):
                    a["name"] = child2.text                     # merilno mesto
                elif (child2.tag == "datum_od"):
                    a["measuring_start"] = child2.text          # datum od
                elif (child2.tag == "datum_do"):
                    a["measuring_end"] = child2.text            # datum do
                elif (child2.tag == "pm10"):
                    if (child2.text.find('<') != -1):
                        a["PM10"] = 0                           # pm10
                    else:
                        a["PM10"] = child2.text
                elif (child2.tag == "pm2.5"):
                    if (child2.text.find('<') != -1):
                        a["PM2_5"] = 0                          # pm2.5
                    else:
                        a["PM2_5"] = child2.text
                elif (child2.tag == "so2"):
                    if (child2.text.find('<') != -1):
                        a["SO2"] = 0                            # so2
                    else:
                        a["SO2"] = child2.text
                elif (child2.tag == "co"):
                    if (child2.text.find('<') != -1):
                        a["CO"] = 0                             # co THIS ONE MAY NOT WORK
                    else:
                        a["CO"] = child2.text
                elif (child2.tag == "o3"):
                    if (child2.text.find('<') != -1):
                        a["O3"] = 0                             # o3
                    else:
                        a["O3"] = child2.text
                elif (child2.tag == "no2"):
                    if (child2.text.find('<') != -1):
                        a["NO2"] = 0                            # no2
                    else:
                        a["NO2"] = child2.text
                elif (child2.tag == "benzen"):
                    if(child2.text.find('<') != -1):
                        a["C6H6"] = 0                           # benzen
                    else:
                        a["C6H6"] = child2.text
                        #print(child2.tag, child2.text)
            else:
                print("NAPAKA5")
                exitcode = 5
                flag = True
                break
        x.append(a)
        a = {}

        if(flag):
            break
    else:
        exitcode = 6

if(exitcode):
    sys.exit(exitcode)
# Pošiljanje v API

host = os.environ['API_URL']
target = f'{host}/air_pollution'
for i in x:
    # Dodajanje regije
    for j in pairs: #optimize pls
        if(i["name"]==j[0]):
            i["region"] = j[1]
            if(source == "arso"):
                i["source"] = "arso"
                i["reliability"] = "100"
    # Priprava json
    try:
        body = json.dumps(i)
        headers = {'Content-Type': 'application/json',
                   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoianVyZWQxMDAiLCJwYXNzd29yZCI6IjEyMzQ1NiIsIl9pZCI6IjYyNzdkZThiYjNjYjFkMjM4MjVkNDU4NiIsIl9fdiI6MH0sImlhdCI6MTY1MjAyMjkyM30.knoCRNm8-gUqc1K5Z15O98mq0O-tDIA-CimgY9Is9Ag'}

        response = requests.post(target, headers=headers, data=body, verify=False)
        #print(response.json())
        #print(json.loads(response.json()))
        if(json.dumps(response.json()).find("validation failed")!=-1):
            print("NAPAKA V APIju")
            exitcode = 7
            print(response.json())
            print(i)
    except Exception as e:
        print("NAPAKA POŠILJANJE V API")
        print(i)
        print(e)
        exitcode = 8
        break

sys.exit(exitcode)