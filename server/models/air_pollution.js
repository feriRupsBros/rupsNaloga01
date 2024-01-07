const mongoose = require('mongoose')

/*
MODEL:
air pollution:
    id (automatically selected),
    name (name of the sensor taking the data),
    region (the region in which the sensor is situated in),
    coordinates{
        longtitude,
        latitude,
        altitude
    } (the exact positional coordinates of the sensor),
    source (source of the data - how we are connecting to the sensor (can be from arso, our own, or made up)),
    reliability (min: 0, max: 100 - a made-up source or a faulty sensor would have lower reliability, gov data would have higher),
    date_time (date and time of when this entry was created),
    concentrations{
        PM10, (particulates with a diameter of 10 micrometers or less)
        PM2_5, (particulates with a diameter of 2,5 micrometers or less)
        SO2, (sulfur dioxide)
        CO, (carbon monoxide)
        O3, (ozone)
        NO2, (nitrogen dioxide)
        C6H6, (benzene)
    } (the actual important part: all of the data on the different parts we collect, if sensor cannot measure null will be written)
    date_time_of_measurement{
        measuring_start,
        measuring_end,
    } (the time at which this data was started to be taken and at which point it ended)
*/

const geoSchema = new mongoose.Schema({
    //Should use Numbers instead? Is it precise? Got mixed answers so string it is
    type: { 
        type: 'String',
        default: 'Point',
        required: true
    },
    coordinates: {
        type: [Number],
        index: "2d",
        required: true,
    },
})

const concentrationsSchema = new mongoose.Schema({ //data type pove al je pm10/pm25 itd. pa value
    PM10: { //delci diameter pod 10 mikrometrov
        type: Number,
        default: null //če senzor ne zaznava mora tukaj noter dati null
    },
    PM2_5: { //delci diameter pod 2.5 mikrometra
        type: Number,
        default: null
    },
    SO2: { //žveplov dioksid
        type: Number,
        default: null
    },
    CO: { //ogljikov monoksid
        type: Number,
        default: null
    },
    O3: { //ozon
        type: Number,
        default: null
    },
    NO2: { //dušikov dioksid
        type: Number,
        default: null
    },
    C6H6: { //benzen
        type: Number,
        default: null
    },
})

const dateTimeOfMeasurementSchema = new mongoose.Schema({
    measuring_start: {
        type: Date,
        required: true
    },
    measuring_end: {
        type: Date,
        required: true
    },
    length: {
        type: String,
    }
})

const air_pollutionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true
    },
    geo: geoSchema,
    source: {
        type: String,
        required: true
    },
    reliability: {
        type: Number,
        required: true
    },
    dateTime: {
        type: Date,
        default: () => Date.now()
    },
    concentrations: concentrationsSchema,
    date_time_of_measurement: dateTimeOfMeasurementSchema,
})

air_pollutionSchema.index({ geo: '2dsphere' });
module.exports = mongoose.model('AirPollution', air_pollutionSchema)