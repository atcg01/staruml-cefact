var forEach = require('async-foreach').forEach;
var notAvailElement = require('../notavailelement');
var utils = require('../utils')


/**
 * @function generateJSONLD
 * @description Generate JSON-LD
 */
function generateJSONLD() {
    let objJsonLD = {};
    objJsonLD['@context'] = getContext();
    objJsonLD['@graph'] = getGraph();
    return objJsonLD;

}

/**
 * @function getContext
 * @description returns the array of JSON-LD context template
 * @returns {Array}
 */
function getContext() {
    let arrContext = [];
    let objContext = {};


    objContext['@version'] = 1.1;
    objContext['@base'] = 'https://edi3.org/2019/11/vocab#';
    objContext['@language'] = 'en';
    objContext['rdf'] = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    objContext['rdfs'] = 'http://www.w3.org/2000/01/rdf-schema#';
    objContext['owl'] = 'http://www.w3.org/2002/07/owl#';
    objContext['xsd'] = 'http://www.w3.org/2001/XMLSchema#';
    objContext['dc'] = 'http://purl.org/dc/terms/';
    objContext['rdfs_classes'] = getRdfsClasses();
    objContext['rdfs_properties'] = getRdfsProperties();
    objContext['rdfs_datatypes'] = getRdfsDatatype();;
    objContext['rdfs_instances'] = getRdfsInstance();

    arrContext.push(objContext);

    return arrContext;

}

/**
 * @function getRdfsClasses
 * @description returns the object of rdf classes
 * @returns {Object}
 */
function getRdfsClasses() {
    let objRdfsClasses = {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
    };

    return objRdfsClasses;

};

/**
 * @function getRdfsProperties
 * @description returns the object of rdf properties
 * @returns {Object}
 */
function getRdfsProperties() {
    let objRdfsProperties = {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
    };

    return objRdfsProperties;
}

/**
 * @function getRdfsDatatype
 * @description returns the object of rdf datatype
 * @returns {Object}
 */
function getRdfsDatatype() {
    let objRdfsDatatype = {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
    };

    return objRdfsDatatype;
}

/**
 * @function getRdfsInstance
 * @description returns the object of rdf instance
 * @returns {Object}
 */
function getRdfsInstance() {
    let objRdfsInstance = {
        "@reverse": "rdfs:isDefinedBy",
        "@type": "@id"
    };

    return objRdfsInstance;
}

/**
 * @function getGraph
 * @description returns the object of graph template
 * @returns {Object}
 */
function getGraph() {
    let objGraph = {};

    objGraph['@id'] = 'https://edi3.org/2019/11/vocab#';
    objGraph['@type'] = 'owl:Ontology';
    objGraph['dc:title'] = 'EDI3 ontology';
    objGraph['dc:description'] = 'This document describes the RDFS vocabulary used for EDI3 UN/CEFACT Standards.';
    objGraph['dc:date'] = getDCDate();
    objGraph['rdfs:seeAlso'] = getSeeAlso();
    objGraph['rdfs_classes'] = getRdfsClassesArr();
    objGraph['rdfs_properties'] = getRdfsPropertiesArr();
    objGraph['rdfs_instances'] = getRdfsInstancesArr();


    return objGraph;
}

/**
 * @function getDCDate
 * @description returns the object of dcdate
 * @returns {Object}
 */
function getDCDate() {
    let dcDate = {
        "@value": "2019-11-29",
        "@type": "xsd:date"
    }
    return dcDate;
}

/**
 * @function getSeeAlso
 * @description returns the object of seealso
 * @returns {Object}
 */
function getSeeAlso() {
    let sAlsoArr = [
        "https://edi3.org/"
    ];
    return sAlsoArr;
}
/**
 * @function getAttrTypeClass
 * @description returns array of classes that is referenced as compound type attribute type
 * @param {*} mClasses
 * @returns {Array} 
 */
function getAttrTypeClass(mClasses) {
    let mNewClasses = [];
    forEach(mClasses, function (mClass) {
        forEach(mClass.attributes, function (attr) {
            if (attr.type instanceof type.UMLClass) {
                let res = mNewClasses.filter(function (item) {
                    return attr.type._id == item._id;
                });
                if (res.length == 0) {
                    mNewClasses.push(attr.type);
                }
            }
        });
    });
    return mNewClasses;
}

let generatedEnumInstance = [];
/**
 * @function getRdfsClassesArr
 * @description returns the array of classes 
 * @returns {Array}
 */
function getRdfsClassesArr() {
    generatedEnumInstance = [];
    let rdfsClassArr = [ /* {# classes #} */ ];
    let mUMLPackage = getExportElement();
    let mClasses = mUMLPackage.ownedElements.filter(function (element) {
        return element instanceof type.UMLClass;
    });

    /*
        Returns classes that have a class type of property of the class
    */
    let mNewClasses = getAttrTypeClass(mClasses);
    /*
        Combine both classes in a singla classes array
    */
    mNewClasses = mClasses.concat(mNewClasses);

    forEach(mNewClasses, function (mClass) {
        let tClass = {};
        tClass['@id'] = mClass.name;
        tClass['@type'] = 'rdfs:Class';
        tClass['rdfs:subClassOf'] = getParentClasses(mClass);

        rdfsClassArr.push(tClass);

        forEach(mClass.attributes, function (attr) {
            if (attr.type instanceof type.UMLEnumeration) {
                let mEnum = attr.type;
                let tClass = {};
                tClass['@id'] = mEnum.name;
                tClass['@type'] = 'rdfs:Class';
                rdfsClassArr.push(tClass);
                generatedEnumInstance.push(attr.type);
            }
        });

    });

    return rdfsClassArr;
}

/**
 * @function getParentClasses
 * @description returns the array of parent classes
 * @returns {Array}
 */
function getParentClasses(mElement) {
    let parentClasses = [];
    let generalization = app.repository.select("@UMLGeneralization");
    forEach(generalization, function (gen) {
        if (gen.source._id == mElement._id) {
            parentClasses.push(gen.target.name);
        }
    });
    return parentClasses;
}

/**
 * @function getRdfsInstancesArr
 * @description returns Rdfs Instance array
 * @returns {Array}
 */
function getRdfsInstancesArr() {
    let rdfsInstancesArr = [ /* {# instances #} */ ];
    let mUMLPackage = getExportElement();
    /* TODO : Do not remove this code 
    let UMLClasses = app.repository.select(mUMLPackage.name + "::@UMLClass");

    let UMLClasses = app.repository.select(mUMLPackage.name + "::@UMLClass");
    let enumArr = [];
    forEach(UMLClasses, function (umlClass) {
        forEach(umlClass.attributes, function (attr) {

            if (attr.type instanceof type.UMLEnumeration) {

                let result = enumArr.filter(function (item) {
                    return item._id == attr.type._id;
                });

                if (result.length == 0) {
                    enumArr.push(attr.type);
                }
            }
        });
    }); 
    */
    let UMLEnumeration = app.repository.select(mUMLPackage.name + "::@UMLEnumeration");

    let newallyFiltered = [];
    /* Omit already generated enum instance ex #59 */
    forEach(UMLEnumeration, function (enume) {
        let result = generatedEnumInstance.filter(function (item) {
            return enume._id == item._id;
        });
        if (result.length == 0) {
            newallyFiltered.push(enume);
        }
    });
    forEach(newallyFiltered, function (enume) {
        forEach(enume.literals, function (literal) {
            let mEnumeObj = {};
            mEnumeObj['@id'] = enume.name + '/' + literal.name;
            mEnumeObj['@type'] = enume.name;
            rdfsInstancesArr.push(mEnumeObj);
        });
    });
    return rdfsInstancesArr;
}
/**
 * @function getRdfsPropertiesArr
 * @description returns the array class properties with template
 * @returns {Array}
 */
function getRdfsPropertiesArr() {
    let rdfsPropertiesArr = [ /* {# properties #} */ ];
    let mUMLPackage = getExportElement();

    let associations = app.repository.select("@UMLAssociation");


    let mClasses = mUMLPackage.ownedElements.filter(function (element) {
        return element instanceof type.UMLClass;
    });

    let mNewClasses = getAttrTypeClass(mClasses);
    mNewClasses = mClasses.concat(mNewClasses);

    forEach(mNewClasses, function (mClass) {

        forEach(mClass.attributes, function (attr) {
            let objProperty = {};
            objProperty['@id'] = mClass.name + '/' + attr.name;
            objProperty['@type'] = 'rdf:Property';
            objProperty['rdfs:domain'] = mClass.name;

            let range = getRange(attr, mClass.name);
            objProperty['rdfs:range'] = range; /* getRange(attr); */
            /* if(utils.isString(attr.type) && range!=''){
                rdfsPropertiesArr.push(objProperty);
            }
            else{

            } */
            rdfsPropertiesArr.push(objProperty);

        });


        let classAssociations = associations.filter(item => {
            return item.end1.reference._id == mClass._id
        });

        classAssociations.forEach(assoc => {
            if (assoc instanceof type.UMLAssociation) {

                let relationName = assoc.name;
                if (relationName != '') {
                    let range = assoc.end2.reference.name;


                    let objProperty = {};
                    objProperty['@id'] = mClass.name + '/' + relationName;
                    objProperty['@type'] = 'rdf:Property';
                    objProperty['rdfs:domain'] = mClass.name;
                    objProperty['rdfs:range'] = range;

                    rdfsPropertiesArr.push(objProperty);
                }

            }
        });
    });

    return rdfsPropertiesArr;
}
let invalidAttributeType = [];
/**
 * @function getRange
 * @description returns datatype
 * @returns {string}
 */
function getRange(attr, className) {
    /* Valid DataType
    Numeric: "rdfs:range": "xsd:nonNegativeInteger"
    Indicator: "rdfs:range": "xsd:boolean"
    Number: "rdfs:range": "xsd:integer"
    Password: "rdfs:range": "xsd:string"
    DateTime: "rdfs:range": "xsd:dateTime"
    Date: "rdfs:range": "xsd:date"
    Int32: "rdfs:range": "xsd:int"
    Int64: "rdfs:range": "xsd:long"
    Float: "rdfs:range": "xsd:float"
    Double: "rdfs:range": "xsd:double"
    Byte: "rdfs:range": "xsd:byte"
     */

    let range = '';
    let attributeType = attr.type;
    if (utils.isString(attributeType)) {

        let jsonldRuleType = utils.getJsonldRuleType();
        let result = jsonldRuleType.filter(function (item) {
            return item.key == attributeType;
        });
        if (result.length != 0) {
            range = result.range;
        } else {

            /* 
            TODO Do not remove this code
            if (attributeType === 'Numeric') {
                range = 'xsd:nonNegativeInteger'; 
            } else if (attributeType === 'Indicator') {
                range = 'xsd:boolean';
            } else if (attributeType === 'Date') {
                range = 'xsd:date';
            } else if (attributeType === 'DateTime') {
                range = 'xsd:dateTime';
            } else if (attributeType === 'Int32') {
                range = 'xsd:int';
            } else if (attributeType === 'Int64') {
                range = 'xsd:long';
            } else if (attributeType === 'Number') {
                range = 'xsd:integer';
            } else if (attributeType === 'Float') {
                range = 'xsd:float';
            } else if (attributeType === 'Double') {
                range = 'xsd:double';
            } else if (attributeType === 'Password') {
                range = 'xsd:string';
            } else if (attributeType === 'Byte') {
                range = 'xsd:byte';
            } else if (attributeType === 'Quantity') {
                range = 'xsd:nonNegativeInteger';
            } else { */


            if (utils.isString(attributeType) && utils.isStringCoreType(attributeType)) {
                notAvailElement.addNotLinkedType(attr._parent.name, attr, attributeType);
            } else {
                /* Check that attribute type is available in this model. Alert not availabe class or enumeration in file */
                notAvailElement.addInvalidAttributeType(className, attr, attributeType);
            }

            if (attributeType === 'Numeric') {
                range = 'xsd:string';
            } else if (attributeType === 'Identifier') {
                range = 'Identifier';
            } else if (attributeType === 'Code') {
                range = 'Code';
            } else if (attributeType === 'Text') {
                range = 'xsd:string';
            } else if (attributeType === 'Binary') {
                range = 'xsd:string';
            } else if (attributeType === 'Measure') {
                range = 'Measure';
            } else if (attributeType === 'Amount') {
                range = 'Amount';
            } else {
                range = attributeType;
            }

        }

    } else {
        return attributeType.name;
    }
    return range;
}


let UMLPackage = null;
let UMLPackageName = null;

/**
 * @function setExportElement
 * @description save UMLPackage
 */
function setExportElement(mUMLPackage) {
    UMLPackage = mUMLPackage;
}

/**
 * @function getExportElement
 * @description return UMLPackage
 * @returns {UMLPackage}
 */
function getExportElement() {
    return UMLPackage;
}

/**
 * @function getInvalidAttributeType
 * @description return undefined attribute type
 * @returns {Array}
 */
function getInvalidAttributeType() {
    return invalidAttributeType;
}

/**
 * @function setExportElementName
 * @description set export element (selected package) name
 * @param {String} mEleName
 */
function setExportElementName(mEleName) {
    UMLPackageName = mEleName;
}

/**
 * @function getExportElementName
 * @description return export element (selected package) name
 * @returns {String}
 */
function getExportElementName() {
    return UMLPackageName;
}

let filePath = '';
/**
 * @function setFilePath
 * @description set jsonld export file path 
 * @param {String} fPath
 */
function setFilePath(fPath) {
    filePath = fPath;
}

/**
 * @function getFilePath
 * @description return jsonld export file path
 * @returns {String}
 */
function getFilePath() {
    return filePath;
}
module.exports.generateJSONLD = generateJSONLD;
module.exports.setExportElement = setExportElement;
module.exports.getExportElement = getExportElement;
module.exports.getInvalidAttributeType = getInvalidAttributeType;
module.exports.setExportElementName = setExportElementName;
module.exports.getExportElementName = getExportElementName;
module.exports.setFilePath = setFilePath;
module.exports.getFilePath = getFilePath;