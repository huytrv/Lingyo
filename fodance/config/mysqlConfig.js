var configValues = require("./mysqlConfig.json")

module.exports = {
    getMysqlUsername: function(){
        return configValues.username
    },
    getMysqlPassword: function(){
        return configValues.password
    }
}