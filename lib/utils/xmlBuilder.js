"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBasicOutcomesXml = buildBasicOutcomesXml;
const xml2js_1 = require("xml2js");
/**
 * Build XML payload for LTI Basic Outcomes replaceResultRequest
 *
 * @param sourcedId - The sourced ID from the LTI launch
 * @param grade - The grade value
 * @param maxScore - Maximum possible score (default: 1.0)
 * @returns XML string for Basic Outcomes request
 */
function buildBasicOutcomesXml(sourcedId, grade, maxScore = 1.0) {
    const xmlBuilder = new xml2js_1.Builder();
    const normalizedGrade = (grade / maxScore).toFixed(2);
    const xmlBody = xmlBuilder.buildObject({
        'imsx_POXEnvelopeRequest': {
            '$': { xmlns: 'http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0' },
            'imsx_POXHeader': {
                'imsx_POXRequestHeaderInfo': {
                    'imsx_version': 'V1.0',
                    'imsx_messageIdentifier': Date.now().toString()
                }
            },
            'imsx_POXBody': {
                'replaceResultRequest': {
                    'resultRecord': {
                        'sourcedGUID': {
                            'sourcedId': sourcedId
                        },
                        'result': {
                            'resultScore': {
                                'language': 'en',
                                'textString': normalizedGrade
                            }
                        }
                    }
                }
            }
        }
    });
    return xmlBody;
}
//# sourceMappingURL=xmlBuilder.js.map