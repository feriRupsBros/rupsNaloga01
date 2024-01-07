/*weather:
    id (automatically selected),
    name (name of sensor taking the data),
    region (the region in which the sensor is situated in),
    coordinates{
        longtitude,
        latitude,
        altitude
    } (the exact positional coordinates of the sensor),
    source (source of the data - how we are connecting to the sensor (can be from arso, our own, or made up)),
    reliability (min: 0, max: 100 - a made-up source or a faulty sensor would have lower reliability, gov data would have higher),
    date_time (date and time of when this entry was created),
    sunrise (when was sunrise),
    sunset (when was sunset),
    air_temperatures{
        temp (in C),
        dew_point_temp (temperatura rosišča in C),
        avg_temp (in C),
        max_temp (in C),
        min_temp (in C),
    }
    rlt_humidity (in %),
    avg_humidity (in %),
    wind{
        avg_wind_direction (in degrees),
        direction_largest_gust_wind (in degrees),
        avg_wind_speed (m/s),
        max_wind_speed (m/s),
    }
    avg_air_pressure_reduced_to_sea_level (in hPa),
    avg_air_pressure (in hPa),
    rainfall (in mm),
    snow_height (in cm),
    solar_radiation{
        global_solar_radiation (in W/m2),
        diffuse_solar_radiation (in W/m2),
        avg_diffuse_solar_radiation (in W/m2),
    }
    visibility (in km),
    ground_temperatures{
        temp_at_5cm (in C),
        temp_at_5cm_depth (in C),
        avg_temp_at_5cm_depth (in C),
        temp_at_10cm_depth (in C),
        avg_temp_at_10cm_depth (in C),
        temp_at_20cm_depth (in C),
        avg_temp_at_20cm_depth (in C),
        temp_at_30cm_depth (in C),
        avg_temp_at_30cm_depth (in C),
        temp_at_50cm_depth (in C),
        avg_temp_at_50cm_depth (in C),
    } (ground temperatures at different depths)
    date_time_of_masurement{
        measuring_start,
        measuring_end,
        length (can be hourly (1) or daily (24))
    } (the time at which this data was started to be taken and at which point it ended - dont know if I have this info TODO)*/

const mongoose = require('mongoose')
    
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

const airTemperaturesSchema = new mongoose.Schema({
    temp: {
        type: Number,
        default: null
    },
    dew_point_temp: {
        type: Number,
        default: null
    },
    avg_temp: {
        type: Number,
        default: null
    },
    max_temp: {
        type: Number,
        default: null
    },
    min_temp: {
        type: Number,
        default: null
    },
})

const windSchema = new mongoose.Schema({
    avg_wind_direction: {
        type: Number,
        default: null
    },
    direction_largest_gust_wind: {
        type: Number,
        default: null
    },
    avg_wind_speed: {
        type: Number,
        default: null
    },
    max_wind_speed: {
        type: Number,
        default: null
    },
})

const solarRadiationSchema = new mongoose.Schema({
    global_solar_radiation: {
        type: Number,
        default: null
    },
    diffuse_solar_radiation: {
        type: Number,
        default: null
    },
    avg_diffuse_solar_radiation: {
        type: Number,
        default: null
    },
})

const groundTemperaturesSchema = new mongoose.Schema({
    temp_at_5cm: {
        type: Number,
        default: null
    },
    temp_at_5cm_depth: {
        type: Number,
        default: null
    },
    avg_temp_at_5cm_depth: {
        type: Number,
        default: null
    },
    temp_at_10cm_depth: {
        type: Number,
        default: null
    },
    avg_temp_at_10cm_depth: {
        type: Number,
        default: null
    },
    temp_at_20cm_depth: {
        type: Number,
        default: null
    },
    avg_temp_at_20cm_depth: {
        type: Number,
        default: null
    },
    temp_at_30cm_depth: {
        type: Number,
        default: null
    },
    avg_temp_at_30cm_depth: {
        type: Number,
        default: null
    },
    temp_at_50cm_depth: {
        type: Number,
        default: null
    },
    avg_temp_at_50cm_depth: {
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

const weatherSchema = new mongoose.Schema({
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
    sunrise: {
        type: Date,
        required: true,
    },
    sunset: {
        type: Date,
        required: true,
    },
    air_temperatures: airTemperaturesSchema,
    rlt_humidity: {
        type: Number,
        default: null
    },
    avg_humidity: {
        type: Number,
        default: null
    },
    wind: windSchema,
    avg_air_pressure_reduced_to_sea_level: {
        type: Number,
        default: null
    },
    avg_air_pressure: {
        type: Number,
        default: null
    },
    rainfall: {
        type: Number,
        default: null
    },
    snow_height: {
        type: Number,
        default: null
    },
    solar_radiation: solarRadiationSchema,
    visibility: {
        type: Number,
        default: null
    },
    ground_temperatures: groundTemperaturesSchema,
    date_time_of_measurement: dateTimeOfMeasurementSchema,
})

weatherSchema.index({ geo: '2dsphere' });
module.exports = mongoose.model('Weather', weatherSchema)