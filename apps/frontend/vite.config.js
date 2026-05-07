var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
var OVERRIDE_HEADER = 'x-lid-meta-token';
/** Extrae el token a usar: header override → env fallback. */
function resolveToken(req, envToken) {
    var header = req.headers[OVERRIDE_HEADER];
    var fromHeader = Array.isArray(header) ? header[0] : header;
    return (fromHeader && fromHeader.trim()) || envToken;
}
/**
 * Plugin: descarga una imagen pública (o firmada de Meta) server-side,
 * la sube al endpoint `/media` del phone number y devuelve el media_id.
 *
 * Se usa antes de enviar una difusión con template que tiene header de imagen:
 * Meta no puede refetchear URLs de scontent.whatsapp.net, pero sí acepta `id`
 * de `/media` como header image en el send.
 */
function metaResendMediaPlugin(env) {
    var _a, _b, _c;
    var version = (_a = env.META_GRAPH_VERSION) !== null && _a !== void 0 ? _a : 'v25.0';
    var phoneNumberId = (_b = env.META_PHONE_NUMBER_ID) !== null && _b !== void 0 ? _b : env.VITE_META_PHONE_NUMBER_ID;
    var envToken = (_c = env.META_ACCESS_TOKEN) !== null && _c !== void 0 ? _c : '';
    return {
        name: 'lid-meta-resend-media',
        configureServer: function (server) {
            var _this = this;
            server.middlewares.use('/api/resend-media', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var sendJson, token, chunks, chunk, e_1_1, body, imgRes, arrayBuf, contentType, extension, form, blob, uploadRes, uploadBody, mediaId, err_1;
                var _a, req_1, req_1_1;
                var _b, e_1, _c, _d;
                var _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            sendJson = function (status, payload) {
                                res.statusCode = status;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(payload));
                            };
                            if (req.method !== 'POST')
                                return [2 /*return*/, sendJson(405, { error: 'Method Not Allowed' })];
                            token = resolveToken(req, envToken);
                            if (!phoneNumberId || !token) {
                                return [2 /*return*/, sendJson(500, { error: 'Falta META_PHONE_NUMBER_ID o token' })];
                            }
                            chunks = [];
                            _j.label = 1;
                        case 1:
                            _j.trys.push([1, 6, 7, 12]);
                            _a = true, req_1 = __asyncValues(req);
                            _j.label = 2;
                        case 2: return [4 /*yield*/, req_1.next()];
                        case 3:
                            if (!(req_1_1 = _j.sent(), _b = req_1_1.done, !_b)) return [3 /*break*/, 5];
                            _d = req_1_1.value;
                            _a = false;
                            chunk = _d;
                            chunks.push(chunk);
                            _j.label = 4;
                        case 4:
                            _a = true;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_1_1 = _j.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _j.trys.push([7, , 10, 11]);
                            if (!(!_a && !_b && (_c = req_1.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _c.call(req_1)];
                        case 8:
                            _j.sent();
                            _j.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            try {
                                body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
                            }
                            catch (_k) {
                                return [2 /*return*/, sendJson(400, { error: 'Body debe ser JSON con { url }' })];
                            }
                            if (!body.url)
                                return [2 /*return*/, sendJson(400, { error: 'Falta url' })];
                            _j.label = 13;
                        case 13:
                            _j.trys.push([13, 18, , 19]);
                            return [4 /*yield*/, fetch(body.url)];
                        case 14:
                            imgRes = _j.sent();
                            if (!imgRes.ok) {
                                return [2 /*return*/, sendJson(502, { error: "No se pudo descargar la imagen (HTTP ".concat(imgRes.status, ")") })];
                            }
                            return [4 /*yield*/, imgRes.arrayBuffer()];
                        case 15:
                            arrayBuf = _j.sent();
                            contentType = (_e = imgRes.headers.get('content-type')) !== null && _e !== void 0 ? _e : 'image/jpeg';
                            extension = (_f = contentType.split('/')[1]) !== null && _f !== void 0 ? _f : 'jpg';
                            form = new FormData();
                            blob = new Blob([arrayBuf], { type: contentType });
                            form.append('messaging_product', 'whatsapp');
                            form.append('type', contentType);
                            form.append('file', blob, "image.".concat(extension));
                            return [4 /*yield*/, fetch("https://graph.facebook.com/".concat(version, "/").concat(phoneNumberId, "/media"), {
                                    method: 'POST',
                                    headers: { Authorization: "Bearer ".concat(token) },
                                    body: form,
                                })];
                        case 16:
                            uploadRes = _j.sent();
                            return [4 /*yield*/, uploadRes.json().catch(function () { return ({}); })];
                        case 17:
                            uploadBody = _j.sent();
                            mediaId = uploadBody === null || uploadBody === void 0 ? void 0 : uploadBody.id;
                            if (!uploadRes.ok || !mediaId) {
                                return [2 /*return*/, sendJson(uploadRes.status || 500, {
                                        error: (_h = (_g = uploadBody === null || uploadBody === void 0 ? void 0 : uploadBody.error) === null || _g === void 0 ? void 0 : _g.message) !== null && _h !== void 0 ? _h : 'Upload a /media falló',
                                        meta: uploadBody === null || uploadBody === void 0 ? void 0 : uploadBody.error,
                                    })];
                            }
                            return [2 /*return*/, sendJson(200, { mediaId: mediaId })];
                        case 18:
                            err_1 = _j.sent();
                            console.error('[resend-media] error', err_1);
                            return [2 /*return*/, sendJson(500, { error: err_1.message })];
                        case 19: return [2 /*return*/];
                    }
                });
            }); });
        },
    };
}
/**
 * Plugin de desarrollo: maneja la subida de media para headers de plantilla.
 * Usa la Resumable Upload API de Meta (2 pasos).
 */
function metaUploadHeaderPlugin(env) {
    var _a, _b;
    var metaVersion = (_a = env.META_GRAPH_VERSION) !== null && _a !== void 0 ? _a : 'v25.0';
    var appId = env.META_APP_ID;
    var envToken = (_b = env.META_ACCESS_TOKEN) !== null && _b !== void 0 ? _b : '';
    return {
        name: 'lid-meta-upload-header',
        configureServer: function (server) {
            var _this = this;
            server.middlewares.use('/api/upload-header', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var sendJson, token, fileName, fileType, fileSize, sessionUrl, s1, s1Body, sessionId, chunks, chunk, e_2_1, bodyBuffer, uploadUrl, s2, s2Body, handle, err_2;
                var _a, req_2, req_2_1;
                var _b, e_2, _c, _d;
                var _e, _f, _g, _h, _j, _k, _l;
                return __generator(this, function (_m) {
                    switch (_m.label) {
                        case 0:
                            sendJson = function (status, payload) {
                                res.statusCode = status;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(payload));
                            };
                            if (req.method !== 'POST')
                                return [2 /*return*/, sendJson(405, { error: 'Method Not Allowed' })];
                            token = resolveToken(req, envToken);
                            if (!appId || !token) {
                                return [2 /*return*/, sendJson(500, {
                                        error: 'META_APP_ID o token no configurados. Cargá uno en Ajustes → Credenciales o agregá META_ACCESS_TOKEN al .env.local.',
                                    })];
                            }
                            fileName = String((_e = req.headers['x-file-name']) !== null && _e !== void 0 ? _e : '');
                            fileType = String((_f = req.headers['x-file-type']) !== null && _f !== void 0 ? _f : '');
                            fileSize = Number((_g = req.headers['x-file-size']) !== null && _g !== void 0 ? _g : 0);
                            if (!fileName || !fileType || !fileSize) {
                                return [2 /*return*/, sendJson(400, { error: 'Faltan headers x-file-name, x-file-type, x-file-size.' })];
                            }
                            _m.label = 1;
                        case 1:
                            _m.trys.push([1, 18, , 19]);
                            sessionUrl = "https://graph.facebook.com/".concat(metaVersion, "/").concat(appId, "/uploads") +
                                "?file_name=".concat(encodeURIComponent(fileName)) +
                                "&file_length=".concat(fileSize) +
                                "&file_type=".concat(encodeURIComponent(fileType));
                            return [4 /*yield*/, fetch(sessionUrl, {
                                    method: 'POST',
                                    headers: { Authorization: "Bearer ".concat(token) },
                                })];
                        case 2:
                            s1 = _m.sent();
                            return [4 /*yield*/, s1.json().catch(function () { return ({}); })];
                        case 3:
                            s1Body = _m.sent();
                            sessionId = s1Body === null || s1Body === void 0 ? void 0 : s1Body.id;
                            if (!s1.ok || !sessionId) {
                                return [2 /*return*/, sendJson(s1.status || 500, {
                                        error: (_j = (_h = s1Body === null || s1Body === void 0 ? void 0 : s1Body.error) === null || _h === void 0 ? void 0 : _h.message) !== null && _j !== void 0 ? _j : 'No se pudo crear la sesión de upload',
                                        meta: s1Body === null || s1Body === void 0 ? void 0 : s1Body.error,
                                    })];
                            }
                            chunks = [];
                            _m.label = 4;
                        case 4:
                            _m.trys.push([4, 9, 10, 15]);
                            _a = true, req_2 = __asyncValues(req);
                            _m.label = 5;
                        case 5: return [4 /*yield*/, req_2.next()];
                        case 6:
                            if (!(req_2_1 = _m.sent(), _b = req_2_1.done, !_b)) return [3 /*break*/, 8];
                            _d = req_2_1.value;
                            _a = false;
                            chunk = _d;
                            chunks.push(chunk);
                            _m.label = 7;
                        case 7:
                            _a = true;
                            return [3 /*break*/, 5];
                        case 8: return [3 /*break*/, 15];
                        case 9:
                            e_2_1 = _m.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 15];
                        case 10:
                            _m.trys.push([10, , 13, 14]);
                            if (!(!_a && !_b && (_c = req_2.return))) return [3 /*break*/, 12];
                            return [4 /*yield*/, _c.call(req_2)];
                        case 11:
                            _m.sent();
                            _m.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            if (e_2) throw e_2.error;
                            return [7 /*endfinally*/];
                        case 14: return [7 /*endfinally*/];
                        case 15:
                            bodyBuffer = Buffer.concat(chunks);
                            uploadUrl = "https://graph.facebook.com/".concat(metaVersion, "/").concat(sessionId);
                            return [4 /*yield*/, fetch(uploadUrl, {
                                    method: 'POST',
                                    headers: {
                                        Authorization: "OAuth ".concat(token),
                                        file_offset: '0',
                                        'Content-Type': 'application/octet-stream',
                                    },
                                    body: bodyBuffer,
                                })];
                        case 16:
                            s2 = _m.sent();
                            return [4 /*yield*/, s2.json().catch(function () { return ({}); })];
                        case 17:
                            s2Body = _m.sent();
                            handle = s2Body === null || s2Body === void 0 ? void 0 : s2Body.h;
                            if (!s2.ok || !handle) {
                                return [2 /*return*/, sendJson(s2.status || 500, {
                                        error: (_l = (_k = s2Body === null || s2Body === void 0 ? void 0 : s2Body.error) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : 'La subida del archivo falló',
                                        meta: s2Body === null || s2Body === void 0 ? void 0 : s2Body.error,
                                    })];
                            }
                            return [2 /*return*/, sendJson(200, { handle: handle })];
                        case 18:
                            err_2 = _m.sent();
                            console.error('[upload-header] error', err_2);
                            return [2 /*return*/, sendJson(500, { error: err_2.message })];
                        case 19: return [2 /*return*/];
                    }
                });
            }); });
        },
    };
}
export default defineConfig(function (_a) {
    var _b, _c;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var envToken = (_b = env.META_ACCESS_TOKEN) !== null && _b !== void 0 ? _b : '';
    var metaVersion = (_c = env.META_GRAPH_VERSION) !== null && _c !== void 0 ? _c : 'v25.0';
    return {
        plugins: [react(), metaUploadHeaderPlugin(env), metaResendMediaPlugin(env)],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: 5173,
            host: true,
            proxy: {
                '/api/meta': {
                    target: 'https://graph.facebook.com',
                    changeOrigin: true,
                    rewrite: function (p) { return p.replace(/^\/api\/meta/, "/".concat(metaVersion)); },
                    configure: function (proxy) {
                        proxy.on('proxyReq', function (proxyReq, req) {
                            var token = resolveToken(req, envToken);
                            if (token) {
                                proxyReq.setHeader('Authorization', "Bearer ".concat(token));
                            }
                            // Siempre removemos el header custom para no mandarlo a Meta
                            proxyReq.removeHeader(OVERRIDE_HEADER);
                        });
                        proxy.on('error', function (err) {
                            console.error('[meta-proxy] error:', err.message);
                        });
                    },
                },
            },
        },
    };
});
