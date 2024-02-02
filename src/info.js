const openAPI = require('./openapi');
const constant = require('../src/constant');

/**
 * @class Info 
 * @description class returns the API Info 
 */
class Info {
     /**
      * @constructor Creates an instance of Info.
      */
     constructor() {
          var version = '';
          var description = '';
          if (openAPI.getExportElement().hasOwnProperty('documentation')) {
               var re = openAPI.getExportElement().documentation.split("\n");
               if (re.length >= 1) {
                    var verArr = re[0].split(":")
                    if (verArr.length > 1) {
                         version = verArr[1];
                    }
               }
               if (re.length > 1) {
                    description = re[1] + '<br><br>' + constant.msg_description;
               }
          }
          this.mainInfoObj = {};
          this.mainInfoObj.description = description;
          this.mainInfoObj.title = openAPI.getExportElementName();
          this.mainInfoObj.version = version;
     }


     /**
      * @function getInfo
      * @description Return Info object 
      * @return {Object}
      * @memberof Info
      */
     getInfo() {
          return this.mainInfoObj;
     }

}

module.exports = Info;