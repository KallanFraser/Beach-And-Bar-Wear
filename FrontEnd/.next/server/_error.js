/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "/_error";
exports.ids = ["/_error"];
exports.modules = {

/***/ "./FetchFunctions/FetchProducts.js":
/*!*****************************************!*\
  !*** ./FetchFunctions/FetchProducts.js ***!
  \*****************************************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);\naxios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/** @format */ /*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\t\tImports\r\n----------------------------------------------------------------------------------------------*/ \n/*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\tFetch Function\r\n----------------------------------------------------------------------------------------------*/ //Fetchs the products but also converts images from bytea to BLOB URLs\n//Set products = useState setter function for all products\nconst fetchProducts = async (setProducts)=>{\n    try {\n        const { data } = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(\"https://beachandbarwear.com/fetchAllProducts\");\n        const ready = data.map((product)=>{\n            //Checks if product.images is actually an array\n            //If so... for each base 64 string, turns it into a usable image\n            //If not an array, then transforms it into an empty array\n            const imageUrls = Array.isArray(product.images) ? product.images.map((b64)=>{\n                return `data:image/jpeg;base64,${b64}`;\n            }) : [];\n            return {\n                ...product,\n                imageUrls\n            };\n        });\n        setProducts(ready);\n        return ready;\n    } catch (error) {\n        console.error(\"Error fetching all product data\", error);\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchProducts);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9GZXRjaEZ1bmN0aW9ucy9GZXRjaFByb2R1Y3RzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsWUFBWSxHQUNaOzs4RkFFOEYsR0FDcEU7QUFFMUI7OzhGQUU4RixHQUM5RixzRUFBc0U7QUFDdEUsMERBQTBEO0FBQzFELE1BQU1DLGdCQUFnQixPQUFPQztJQUM1QixJQUFJO1FBQ0gsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBRyxNQUFNSCxpREFBUyxDQUFDO1FBRWpDLE1BQU1LLFFBQVFGLEtBQUtHLEdBQUcsQ0FBQyxDQUFDQztZQUN2QiwrQ0FBK0M7WUFDL0MsZ0VBQWdFO1lBQ2hFLHlEQUF5RDtZQUN6RCxNQUFNQyxZQUFZQyxNQUFNQyxPQUFPLENBQUNILFFBQVFJLE1BQU0sSUFDM0NKLFFBQVFJLE1BQU0sQ0FBQ0wsR0FBRyxDQUFDLENBQUNNO2dCQUNwQixPQUFPLENBQUMsdUJBQXVCLEVBQUVBLEtBQUs7WUFDdEMsS0FDQSxFQUFFO1lBRUwsT0FBTztnQkFDTixHQUFHTCxPQUFPO2dCQUNWQztZQUNEO1FBQ0Q7UUFFQU4sWUFBWUc7UUFDWixPQUFPQTtJQUNSLEVBQUUsT0FBT1EsT0FBTztRQUNmQyxRQUFRRCxLQUFLLENBQUMsbUNBQW1DQTtJQUNsRDtBQUNEO0FBRUEsaUVBQWVaLGFBQWFBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xca2FsbGFcXE9uZURyaXZlXFxEb2N1bWVudHNcXERlY29kaW5nLVNFQ1xcQmVhY2gtQW5kLUJhci1XZWFyXFxGcm9udEVuZFxcRmV0Y2hGdW5jdGlvbnNcXEZldGNoUHJvZHVjdHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBmb3JtYXQgKi9cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRJbXBvcnRzXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRGZXRjaCBGdW5jdGlvblxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLy9GZXRjaHMgdGhlIHByb2R1Y3RzIGJ1dCBhbHNvIGNvbnZlcnRzIGltYWdlcyBmcm9tIGJ5dGVhIHRvIEJMT0IgVVJMc1xyXG4vL1NldCBwcm9kdWN0cyA9IHVzZVN0YXRlIHNldHRlciBmdW5jdGlvbiBmb3IgYWxsIHByb2R1Y3RzXHJcbmNvbnN0IGZldGNoUHJvZHVjdHMgPSBhc3luYyAoc2V0UHJvZHVjdHMpID0+IHtcclxuXHR0cnkge1xyXG5cdFx0Y29uc3QgeyBkYXRhIH0gPSBhd2FpdCBheGlvcy5nZXQoXCJodHRwczovL2JlYWNoYW5kYmFyd2Vhci5jb20vZmV0Y2hBbGxQcm9kdWN0c1wiKTtcclxuXHJcblx0XHRjb25zdCByZWFkeSA9IGRhdGEubWFwKChwcm9kdWN0KSA9PiB7XHJcblx0XHRcdC8vQ2hlY2tzIGlmIHByb2R1Y3QuaW1hZ2VzIGlzIGFjdHVhbGx5IGFuIGFycmF5XHJcblx0XHRcdC8vSWYgc28uLi4gZm9yIGVhY2ggYmFzZSA2NCBzdHJpbmcsIHR1cm5zIGl0IGludG8gYSB1c2FibGUgaW1hZ2VcclxuXHRcdFx0Ly9JZiBub3QgYW4gYXJyYXksIHRoZW4gdHJhbnNmb3JtcyBpdCBpbnRvIGFuIGVtcHR5IGFycmF5XHJcblx0XHRcdGNvbnN0IGltYWdlVXJscyA9IEFycmF5LmlzQXJyYXkocHJvZHVjdC5pbWFnZXMpXHJcblx0XHRcdFx0PyBwcm9kdWN0LmltYWdlcy5tYXAoKGI2NCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYGRhdGE6aW1hZ2UvanBlZztiYXNlNjQsJHtiNjR9YDtcclxuXHRcdFx0XHQgIH0pXHJcblx0XHRcdFx0OiBbXTtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Li4ucHJvZHVjdCxcclxuXHRcdFx0XHRpbWFnZVVybHMsXHJcblx0XHRcdH07XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZXRQcm9kdWN0cyhyZWFkeSk7XHJcblx0XHRyZXR1cm4gcmVhZHk7XHJcblx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBhbGwgcHJvZHVjdCBkYXRhXCIsIGVycm9yKTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmZXRjaFByb2R1Y3RzO1xyXG4iXSwibmFtZXMiOlsiYXhpb3MiLCJmZXRjaFByb2R1Y3RzIiwic2V0UHJvZHVjdHMiLCJkYXRhIiwiZ2V0IiwicmVhZHkiLCJtYXAiLCJwcm9kdWN0IiwiaW1hZ2VVcmxzIiwiQXJyYXkiLCJpc0FycmF5IiwiaW1hZ2VzIiwiYjY0IiwiZXJyb3IiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./FetchFunctions/FetchProducts.js\n");

/***/ }),

/***/ "./GlobalContext.jsx":
/*!***************************!*\
  !*** ./GlobalContext.jsx ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GlobalContext: () => (/* binding */ GlobalContext),\n/* harmony export */   GlobalProvider: () => (/* binding */ GlobalProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FetchFunctions/FetchProducts.js */ \"./FetchFunctions/FetchProducts.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__]);\n_FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/** @format */ /*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\t\tImports\r\n----------------------------------------------------------------------------------------------*/ \n\n//Fetch Imports\n\n/*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\tGlobal Context\r\n----------------------------------------------------------------------------------------------*/ /*\r\nAllows us to store data globally, not just in one component.\r\nCan access and update that data from anywhere in our component tree.\r\nIts state will persist across different pages and routes.\r\nIn other words, it will not be lost on navigation via routes.\r\nPerfect for:\r\n - Logged in user info\r\n - Shopping cart contents\r\n - Preferences\r\n*/ const GlobalContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst GlobalProvider = ({ children })=>{\n    const [products, setProducts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [cart, setCart] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [isDayMode, setIsDayMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"GlobalProvider.useEffect\": ()=>{\n            const load = {\n                \"GlobalProvider.useEffect.load\": async ()=>{\n                    setLoading(true);\n                    await (0,_FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(setProducts);\n                    setLoading(false);\n                }\n            }[\"GlobalProvider.useEffect.load\"];\n            load();\n        }\n    }[\"GlobalProvider.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(GlobalContext.Provider, {\n        value: {\n            products,\n            setProducts,\n            cart,\n            setCart,\n            loading,\n            isDayMode,\n            setIsDayMode\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\GlobalContext.jsx\",\n        lineNumber: 44,\n        columnNumber: 3\n    }, undefined);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9HbG9iYWxDb250ZXh0LmpzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsWUFBWSxHQUNaOzs4RkFFOEY7QUFDbkM7QUFFM0QsZUFBZTtBQUMrQztBQUM5RDs7OEZBRThGLEdBQzlGOzs7Ozs7Ozs7QUFTQSxHQUVPLE1BQU1JLDhCQUFnQkosb0RBQWFBLEdBQUc7QUFFdEMsTUFBTUssaUJBQWlCLENBQUMsRUFBRUMsUUFBUSxFQUFFO0lBQzFDLE1BQU0sQ0FBQ0MsVUFBVUMsWUFBWSxHQUFHUCwrQ0FBUUEsQ0FBQyxFQUFFO0lBQzNDLE1BQU0sQ0FBQ1EsU0FBU0MsV0FBVyxHQUFHVCwrQ0FBUUEsQ0FBQztJQUV2QyxNQUFNLENBQUNVLE1BQU1DLFFBQVEsR0FBR1gsK0NBQVFBLENBQUMsRUFBRTtJQUVuQyxNQUFNLENBQUNZLFdBQVdDLGFBQWEsR0FBR2IsK0NBQVFBLENBQUM7SUFFM0NDLGdEQUFTQTtvQ0FBQztZQUNULE1BQU1hO2lEQUFPO29CQUNaTCxXQUFXO29CQUNYLE1BQU1QLDRFQUFhQSxDQUFDSztvQkFDcEJFLFdBQVc7Z0JBQ1o7O1lBRUFLO1FBQ0Q7bUNBQUcsRUFBRTtJQUVMLHFCQUNDLDhEQUFDWCxjQUFjWSxRQUFRO1FBQ3RCQyxPQUFPO1lBQUVWO1lBQVVDO1lBQWFHO1lBQU1DO1lBQVNIO1lBQVNJO1lBQVdDO1FBQWE7a0JBRS9FUjs7Ozs7O0FBR0osRUFBRSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxrYWxsYVxcT25lRHJpdmVcXERvY3VtZW50c1xcRGVjb2RpbmctU0VDXFxCZWFjaC1BbmQtQmFyLVdlYXJcXEZyb250RW5kXFxHbG9iYWxDb250ZXh0LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGZvcm1hdCAqL1xyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEltcG9ydHNcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbmltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbi8vRmV0Y2ggSW1wb3J0c1xyXG5pbXBvcnQgZmV0Y2hQcm9kdWN0cyBmcm9tIFwiLi9GZXRjaEZ1bmN0aW9ucy9GZXRjaFByb2R1Y3RzLmpzXCI7XHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0XHRcdFx0XHRcdEdsb2JhbCBDb250ZXh0XHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKlxyXG5BbGxvd3MgdXMgdG8gc3RvcmUgZGF0YSBnbG9iYWxseSwgbm90IGp1c3QgaW4gb25lIGNvbXBvbmVudC5cclxuQ2FuIGFjY2VzcyBhbmQgdXBkYXRlIHRoYXQgZGF0YSBmcm9tIGFueXdoZXJlIGluIG91ciBjb21wb25lbnQgdHJlZS5cclxuSXRzIHN0YXRlIHdpbGwgcGVyc2lzdCBhY3Jvc3MgZGlmZmVyZW50IHBhZ2VzIGFuZCByb3V0ZXMuXHJcbkluIG90aGVyIHdvcmRzLCBpdCB3aWxsIG5vdCBiZSBsb3N0IG9uIG5hdmlnYXRpb24gdmlhIHJvdXRlcy5cclxuUGVyZmVjdCBmb3I6XHJcbiAtIExvZ2dlZCBpbiB1c2VyIGluZm9cclxuIC0gU2hvcHBpbmcgY2FydCBjb250ZW50c1xyXG4gLSBQcmVmZXJlbmNlc1xyXG4qL1xyXG5cclxuZXhwb3J0IGNvbnN0IEdsb2JhbENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5leHBvcnQgY29uc3QgR2xvYmFsUHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcblx0Y29uc3QgW3Byb2R1Y3RzLCBzZXRQcm9kdWN0c10gPSB1c2VTdGF0ZShbXSk7XHJcblx0Y29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcblxyXG5cdGNvbnN0IFtjYXJ0LCBzZXRDYXJ0XSA9IHVzZVN0YXRlKFtdKTtcclxuXHJcblx0Y29uc3QgW2lzRGF5TW9kZSwgc2V0SXNEYXlNb2RlXSA9IHVzZVN0YXRlKHRydWUpO1xyXG5cclxuXHR1c2VFZmZlY3QoKCkgPT4ge1xyXG5cdFx0Y29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcclxuXHRcdFx0c2V0TG9hZGluZyh0cnVlKTtcclxuXHRcdFx0YXdhaXQgZmV0Y2hQcm9kdWN0cyhzZXRQcm9kdWN0cyk7XHJcblx0XHRcdHNldExvYWRpbmcoZmFsc2UpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRsb2FkKCk7XHJcblx0fSwgW10pO1xyXG5cclxuXHRyZXR1cm4gKFxyXG5cdFx0PEdsb2JhbENvbnRleHQuUHJvdmlkZXJcclxuXHRcdFx0dmFsdWU9e3sgcHJvZHVjdHMsIHNldFByb2R1Y3RzLCBjYXJ0LCBzZXRDYXJ0LCBsb2FkaW5nLCBpc0RheU1vZGUsIHNldElzRGF5TW9kZSB9fVxyXG5cdFx0PlxyXG5cdFx0XHR7Y2hpbGRyZW59XHJcblx0XHQ8L0dsb2JhbENvbnRleHQuUHJvdmlkZXI+XHJcblx0KTtcclxufTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsImZldGNoUHJvZHVjdHMiLCJHbG9iYWxDb250ZXh0IiwiR2xvYmFsUHJvdmlkZXIiLCJjaGlsZHJlbiIsInByb2R1Y3RzIiwic2V0UHJvZHVjdHMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImNhcnQiLCJzZXRDYXJ0IiwiaXNEYXlNb2RlIiwic2V0SXNEYXlNb2RlIiwibG9hZCIsIlByb3ZpZGVyIiwidmFsdWUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./GlobalContext.jsx\n");

/***/ }),

/***/ "./Styles/ButtonAndCartSection.css":
/*!*****************************************!*\
  !*** ./Styles/ButtonAndCartSection.css ***!
  \*****************************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/HomePage.css":
/*!*****************************!*\
  !*** ./Styles/HomePage.css ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/LandingPage.css":
/*!********************************!*\
  !*** ./Styles/LandingPage.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/NavigationBar.css":
/*!**********************************!*\
  !*** ./Styles/NavigationBar.css ***!
  \**********************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/OrderConfirmationPage.css":
/*!******************************************!*\
  !*** ./Styles/OrderConfirmationPage.css ***!
  \******************************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/PaymentPage.css":
/*!********************************!*\
  !*** ./Styles/PaymentPage.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/ProductCard.css":
/*!********************************!*\
  !*** ./Styles/ProductCard.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/ViewCartPage.css":
/*!*********************************!*\
  !*** ./Styles/ViewCartPage.css ***!
  \*********************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/ViewProductPage.css":
/*!************************************!*\
  !*** ./Styles/ViewProductPage.css ***!
  \************************************/
/***/ (() => {



/***/ }),

/***/ "./Styles/globals.css":
/*!****************************!*\
  !*** ./Styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=.%2Fnode_modules%5Cnext%5Cdist%5Cpages%5C_error.js&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=.%2Fnode_modules%5Cnext%5Cdist%5Cpages%5C_error.js&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   getServerSideProps: () => (/* binding */ getServerSideProps),\n/* harmony export */   getStaticPaths: () => (/* binding */ getStaticPaths),\n/* harmony export */   getStaticProps: () => (/* binding */ getStaticProps),\n/* harmony export */   reportWebVitals: () => (/* binding */ reportWebVitals),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   unstable_getServerProps: () => (/* binding */ unstable_getServerProps),\n/* harmony export */   unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),\n/* harmony export */   unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),\n/* harmony export */   unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),\n/* harmony export */   unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/pages/module.compiled */ \"./node_modules/next/dist/server/route-modules/pages/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var private_next_pages_document__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! private-next-pages/_document */ \"./node_modules/next/dist/pages/_document.js\");\n/* harmony import */ var private_next_pages_document__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(private_next_pages_document__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var private_next_pages_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! private-next-pages/_app */ \"./pages/_app.jsx\");\n/* harmony import */ var _node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules\\next\\dist\\pages\\_error.js */ \"./node_modules/next/dist/pages/_error.js\");\n/* harmony import */ var _node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([private_next_pages_app__WEBPACK_IMPORTED_MODULE_4__]);\nprivate_next_pages_app__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n// Import the app and document modules.\n\n\n// Import the userland code.\n\n// Re-export the component (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'default'));\n// Re-export methods.\nconst getStaticProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'getStaticProps');\nconst getStaticPaths = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'getStaticPaths');\nconst getServerSideProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'getServerSideProps');\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'config');\nconst reportWebVitals = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'reportWebVitals');\n// Re-export legacy methods.\nconst unstable_getStaticProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getStaticProps');\nconst unstable_getStaticPaths = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getStaticPaths');\nconst unstable_getStaticParams = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getStaticParams');\nconst unstable_getServerProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getServerProps');\nconst unstable_getServerSideProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getServerSideProps');\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES,\n        page: \"/_error\",\n        pathname: \"/_error\",\n        // The following aren't used in production.\n        bundlePath: '',\n        filename: ''\n    },\n    components: {\n        // default export might not exist when optimized for data only\n        App: private_next_pages_app__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n        Document: (private_next_pages_document__WEBPACK_IMPORTED_MODULE_3___default())\n    },\n    userland: _node_modules_next_dist_pages_error_js__WEBPACK_IMPORTED_MODULE_5__\n});\n\n//# sourceMappingURL=pages.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTJnBhZ2U9JTJGX2Vycm9yJnByZWZlcnJlZFJlZ2lvbj0mYWJzb2x1dGVQYWdlUGF0aD0uJTJGbm9kZV9tb2R1bGVzJTVDbmV4dCU1Q2Rpc3QlNUNwYWdlcyU1Q19lcnJvci5qcyZhYnNvbHV0ZUFwcFBhdGg9cHJpdmF0ZS1uZXh0LXBhZ2VzJTJGX2FwcCZhYnNvbHV0ZURvY3VtZW50UGF0aD1wcml2YXRlLW5leHQtcGFnZXMlMkZfZG9jdW1lbnQmbWlkZGxld2FyZUNvbmZpZ0Jhc2U2ND1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUF3RjtBQUNoQztBQUNFO0FBQzFEO0FBQ3lEO0FBQ1Y7QUFDL0M7QUFDeUU7QUFDekU7QUFDQSxpRUFBZSx3RUFBSyxDQUFDLG1FQUFRLFlBQVksRUFBQztBQUMxQztBQUNPLHVCQUF1Qix3RUFBSyxDQUFDLG1FQUFRO0FBQ3JDLHVCQUF1Qix3RUFBSyxDQUFDLG1FQUFRO0FBQ3JDLDJCQUEyQix3RUFBSyxDQUFDLG1FQUFRO0FBQ3pDLGVBQWUsd0VBQUssQ0FBQyxtRUFBUTtBQUM3Qix3QkFBd0Isd0VBQUssQ0FBQyxtRUFBUTtBQUM3QztBQUNPLGdDQUFnQyx3RUFBSyxDQUFDLG1FQUFRO0FBQzlDLGdDQUFnQyx3RUFBSyxDQUFDLG1FQUFRO0FBQzlDLGlDQUFpQyx3RUFBSyxDQUFDLG1FQUFRO0FBQy9DLGdDQUFnQyx3RUFBSyxDQUFDLG1FQUFRO0FBQzlDLG9DQUFvQyx3RUFBSyxDQUFDLG1FQUFRO0FBQ3pEO0FBQ08sd0JBQXdCLGtHQUFnQjtBQUMvQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBYSw4REFBVztBQUN4QixrQkFBa0Isb0VBQWdCO0FBQ2xDLEtBQUs7QUFDTCxZQUFZO0FBQ1osQ0FBQzs7QUFFRCxpQyIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2VzUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL3BhZ2VzL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIGFwcCBhbmQgZG9jdW1lbnQgbW9kdWxlcy5cbmltcG9ydCAqIGFzIGRvY3VtZW50IGZyb20gXCJwcml2YXRlLW5leHQtcGFnZXMvX2RvY3VtZW50XCI7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcInByaXZhdGUtbmV4dC1wYWdlcy9fYXBwXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9ub2RlX21vZHVsZXNcXFxcbmV4dFxcXFxkaXN0XFxcXHBhZ2VzXFxcXF9lcnJvci5qc1wiO1xuLy8gUmUtZXhwb3J0IHRoZSBjb21wb25lbnQgKHNob3VsZCBiZSB0aGUgZGVmYXVsdCBleHBvcnQpLlxuZXhwb3J0IGRlZmF1bHQgaG9pc3QodXNlcmxhbmQsICdkZWZhdWx0Jyk7XG4vLyBSZS1leHBvcnQgbWV0aG9kcy5cbmV4cG9ydCBjb25zdCBnZXRTdGF0aWNQcm9wcyA9IGhvaXN0KHVzZXJsYW5kLCAnZ2V0U3RhdGljUHJvcHMnKTtcbmV4cG9ydCBjb25zdCBnZXRTdGF0aWNQYXRocyA9IGhvaXN0KHVzZXJsYW5kLCAnZ2V0U3RhdGljUGF0aHMnKTtcbmV4cG9ydCBjb25zdCBnZXRTZXJ2ZXJTaWRlUHJvcHMgPSBob2lzdCh1c2VybGFuZCwgJ2dldFNlcnZlclNpZGVQcm9wcycpO1xuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IGhvaXN0KHVzZXJsYW5kLCAnY29uZmlnJyk7XG5leHBvcnQgY29uc3QgcmVwb3J0V2ViVml0YWxzID0gaG9pc3QodXNlcmxhbmQsICdyZXBvcnRXZWJWaXRhbHMnKTtcbi8vIFJlLWV4cG9ydCBsZWdhY3kgbWV0aG9kcy5cbmV4cG9ydCBjb25zdCB1bnN0YWJsZV9nZXRTdGF0aWNQcm9wcyA9IGhvaXN0KHVzZXJsYW5kLCAndW5zdGFibGVfZ2V0U3RhdGljUHJvcHMnKTtcbmV4cG9ydCBjb25zdCB1bnN0YWJsZV9nZXRTdGF0aWNQYXRocyA9IGhvaXN0KHVzZXJsYW5kLCAndW5zdGFibGVfZ2V0U3RhdGljUGF0aHMnKTtcbmV4cG9ydCBjb25zdCB1bnN0YWJsZV9nZXRTdGF0aWNQYXJhbXMgPSBob2lzdCh1c2VybGFuZCwgJ3Vuc3RhYmxlX2dldFN0YXRpY1BhcmFtcycpO1xuZXhwb3J0IGNvbnN0IHVuc3RhYmxlX2dldFNlcnZlclByb3BzID0gaG9pc3QodXNlcmxhbmQsICd1bnN0YWJsZV9nZXRTZXJ2ZXJQcm9wcycpO1xuZXhwb3J0IGNvbnN0IHVuc3RhYmxlX2dldFNlcnZlclNpZGVQcm9wcyA9IGhvaXN0KHVzZXJsYW5kLCAndW5zdGFibGVfZ2V0U2VydmVyU2lkZVByb3BzJyk7XG4vLyBDcmVhdGUgYW5kIGV4cG9ydCB0aGUgcm91dGUgbW9kdWxlIHRoYXQgd2lsbCBiZSBjb25zdW1lZC5cbmV4cG9ydCBjb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBQYWdlc1JvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5QQUdFUyxcbiAgICAgICAgcGFnZTogXCIvX2Vycm9yXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9fZXJyb3JcIixcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBhcmVuJ3QgdXNlZCBpbiBwcm9kdWN0aW9uLlxuICAgICAgICBidW5kbGVQYXRoOiAnJyxcbiAgICAgICAgZmlsZW5hbWU6ICcnXG4gICAgfSxcbiAgICBjb21wb25lbnRzOiB7XG4gICAgICAgIC8vIGRlZmF1bHQgZXhwb3J0IG1pZ2h0IG5vdCBleGlzdCB3aGVuIG9wdGltaXplZCBmb3IgZGF0YSBvbmx5XG4gICAgICAgIEFwcDogYXBwLmRlZmF1bHQsXG4gICAgICAgIERvY3VtZW50OiBkb2N1bWVudC5kZWZhdWx0XG4gICAgfSxcbiAgICB1c2VybGFuZFxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2VzLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=.%2Fnode_modules%5Cnext%5Cdist%5Cpages%5C_error.js&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "./pages/_app.jsx":
/*!************************!*\
  !*** ./pages/_app.jsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Styles/globals.css */ \"./Styles/globals.css\");\n/* harmony import */ var _Styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _Styles_LandingPage_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Styles/LandingPage.css */ \"./Styles/LandingPage.css\");\n/* harmony import */ var _Styles_LandingPage_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Styles_LandingPage_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Styles_HomePage_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Styles/HomePage.css */ \"./Styles/HomePage.css\");\n/* harmony import */ var _Styles_HomePage_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Styles_HomePage_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _Styles_ViewProductPage_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Styles/ViewProductPage.css */ \"./Styles/ViewProductPage.css\");\n/* harmony import */ var _Styles_ViewProductPage_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Styles_ViewProductPage_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _Styles_ViewCartPage_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Styles/ViewCartPage.css */ \"./Styles/ViewCartPage.css\");\n/* harmony import */ var _Styles_ViewCartPage_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Styles_ViewCartPage_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _Styles_PaymentPage_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Styles/PaymentPage.css */ \"./Styles/PaymentPage.css\");\n/* harmony import */ var _Styles_PaymentPage_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_Styles_PaymentPage_css__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _Styles_OrderConfirmationPage_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Styles/OrderConfirmationPage.css */ \"./Styles/OrderConfirmationPage.css\");\n/* harmony import */ var _Styles_OrderConfirmationPage_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_Styles_OrderConfirmationPage_css__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _Styles_ButtonAndCartSection_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Styles/ButtonAndCartSection.css */ \"./Styles/ButtonAndCartSection.css\");\n/* harmony import */ var _Styles_ButtonAndCartSection_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_Styles_ButtonAndCartSection_css__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _Styles_NavigationBar_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Styles/NavigationBar.css */ \"./Styles/NavigationBar.css\");\n/* harmony import */ var _Styles_NavigationBar_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_Styles_NavigationBar_css__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _Styles_ProductCard_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Styles/ProductCard.css */ \"./Styles/ProductCard.css\");\n/* harmony import */ var _Styles_ProductCard_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_Styles_ProductCard_css__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/script */ \"./node_modules/next/script.js\");\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_script__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var _GlobalContext__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../GlobalContext */ \"./GlobalContext.jsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_GlobalContext__WEBPACK_IMPORTED_MODULE_12__]);\n_GlobalContext__WEBPACK_IMPORTED_MODULE_12__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/** @format */ /*---------------------------------------------------------------------------------------------\r\n                                        Imports\r\n----------------------------------------------------------------------------------------------*/ // Global CSS\n\n\n\n\n\n\n\n\n\n\n\n\n// Global Context\n\n/*---------------------------------------------------------------------------------------------\r\n                                        Main App\r\n----------------------------------------------------------------------------------------------*/ function App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_script__WEBPACK_IMPORTED_MODULE_11___default()), {\n                src: \"https://js.stripe.com/v3/\",\n                strategy: \"beforeInteractive\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\pages\\\\_app.jsx\",\n                lineNumber: 28,\n                columnNumber: 4\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_GlobalContext__WEBPACK_IMPORTED_MODULE_12__.GlobalProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\pages\\\\_app.jsx\",\n                    lineNumber: 30,\n                    columnNumber: 5\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\pages\\\\_app.jsx\",\n                lineNumber: 29,\n                columnNumber: 4\n            }, this)\n        ]\n    }, void 0, true);\n} //<Script src=\"https://js.stripe.com/v3/\" strategy=\"beforeInteractive\" />\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFlBQVksR0FDWjs7OEZBRThGLEdBQzlGLGFBQWE7O0FBQ2tCO0FBQ0k7QUFDSDtBQUNPO0FBQ0g7QUFDRDtBQUNVO0FBQ0Q7QUFDUDtBQUNGO0FBRUY7QUFFakMsaUJBQWlCO0FBQ2lDO0FBRWxEOzs4RkFFOEYsR0FDL0UsU0FBU0UsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNuRCxxQkFDQzs7MEJBQ0MsOERBQUNKLHFEQUFNQTtnQkFBQ0ssS0FBSTtnQkFBNEJDLFVBQVM7Ozs7OzswQkFDakQsOERBQUNMLDJEQUFjQTswQkFDZCw0RUFBQ0U7b0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7OztBQUk1QixFQUVBLHlFQUF5RSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxrYWxsYVxcT25lRHJpdmVcXERvY3VtZW50c1xcRGVjb2RpbmctU0VDXFxCZWFjaC1BbmQtQmFyLVdlYXJcXEZyb250RW5kXFxwYWdlc1xcX2FwcC5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBmb3JtYXQgKi9cclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEltcG9ydHNcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8vIEdsb2JhbCBDU1NcclxuaW1wb3J0IFwiLi4vU3R5bGVzL2dsb2JhbHMuY3NzXCI7XHJcbmltcG9ydCBcIi4uL1N0eWxlcy9MYW5kaW5nUGFnZS5jc3NcIjtcclxuaW1wb3J0IFwiLi4vU3R5bGVzL0hvbWVQYWdlLmNzc1wiO1xyXG5pbXBvcnQgXCIuLi9TdHlsZXMvVmlld1Byb2R1Y3RQYWdlLmNzc1wiO1xyXG5pbXBvcnQgXCIuLi9TdHlsZXMvVmlld0NhcnRQYWdlLmNzc1wiO1xyXG5pbXBvcnQgXCIuLi9TdHlsZXMvUGF5bWVudFBhZ2UuY3NzXCI7XHJcbmltcG9ydCBcIi4uL1N0eWxlcy9PcmRlckNvbmZpcm1hdGlvblBhZ2UuY3NzXCI7XHJcbmltcG9ydCBcIi4uL1N0eWxlcy9CdXR0b25BbmRDYXJ0U2VjdGlvbi5jc3NcIjtcclxuaW1wb3J0IFwiLi4vU3R5bGVzL05hdmlnYXRpb25CYXIuY3NzXCI7XHJcbmltcG9ydCBcIi4uL1N0eWxlcy9Qcm9kdWN0Q2FyZC5jc3NcIjtcclxuXHJcbmltcG9ydCBTY3JpcHQgZnJvbSBcIm5leHQvc2NyaXB0XCI7XHJcblxyXG4vLyBHbG9iYWwgQ29udGV4dFxyXG5pbXBvcnQgeyBHbG9iYWxQcm92aWRlciB9IGZyb20gXCIuLi9HbG9iYWxDb250ZXh0XCI7XHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWFpbiBBcHBcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcclxuXHRyZXR1cm4gKFxyXG5cdFx0PD5cclxuXHRcdFx0PFNjcmlwdCBzcmM9XCJodHRwczovL2pzLnN0cmlwZS5jb20vdjMvXCIgc3RyYXRlZ3k9XCJiZWZvcmVJbnRlcmFjdGl2ZVwiIC8+XHJcblx0XHRcdDxHbG9iYWxQcm92aWRlcj5cclxuXHRcdFx0XHQ8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcblx0XHRcdDwvR2xvYmFsUHJvdmlkZXI+XHJcblx0XHQ8Lz5cclxuXHQpO1xyXG59XHJcblxyXG4vLzxTY3JpcHQgc3JjPVwiaHR0cHM6Ly9qcy5zdHJpcGUuY29tL3YzL1wiIHN0cmF0ZWd5PVwiYmVmb3JlSW50ZXJhY3RpdmVcIiAvPlxyXG4iXSwibmFtZXMiOlsiU2NyaXB0IiwiR2xvYmFsUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJzcmMiLCJzdHJhdGVneSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.jsx\n");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=.%2Fnode_modules%5Cnext%5Cdist%5Cpages%5C_error.js&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();