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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./FetchFunctions/FetchProducts.js":
/*!*****************************************!*\
  !*** ./FetchFunctions/FetchProducts.js ***!
  \*****************************************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__]);\naxios__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/** @format */ /*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\t\tImports\r\n----------------------------------------------------------------------------------------------*/ \n/*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\tFetch Function\r\n----------------------------------------------------------------------------------------------*/ //Fetchs the products but also converts images from bytea to BLOB URLs\n//Set products = useState setter function for all products\nconst fetchProducts = async (setProducts)=>{\n    try {\n        const { data } = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(\"https://beachandbarwear.com/fetchAllProducts\");\n        const ready = data.map((product)=>{\n            //Checks if product.images is actually an array\n            //If so... for each base 64 string, turns it into a usable image\n            //If not an array, then transforms it into an empty array\n            const imageUrls = Array.isArray(product.images) ? product.images.map((b64)=>{\n                return `data:image/jpeg;base64,${b64}`;\n            }) : [];\n            return {\n                ...product,\n                imageUrls\n            };\n        });\n        setProducts(ready);\n        return ready;\n    } catch (error) {\n        console.error(\"Error fetching all product data\", error);\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetchProducts);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL0ZldGNoRnVuY3Rpb25zL0ZldGNoUHJvZHVjdHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxZQUFZLEdBQ1o7OzhGQUU4RixHQUNwRTtBQUUxQjs7OEZBRThGLEdBQzlGLHNFQUFzRTtBQUN0RSwwREFBMEQ7QUFDMUQsTUFBTUMsZ0JBQWdCLE9BQU9DO0lBQzVCLElBQUk7UUFDSCxNQUFNLEVBQUVDLElBQUksRUFBRSxHQUFHLE1BQU1ILGlEQUFTLENBQUM7UUFFakMsTUFBTUssUUFBUUYsS0FBS0csR0FBRyxDQUFDLENBQUNDO1lBQ3ZCLCtDQUErQztZQUMvQyxnRUFBZ0U7WUFDaEUseURBQXlEO1lBQ3pELE1BQU1DLFlBQVlDLE1BQU1DLE9BQU8sQ0FBQ0gsUUFBUUksTUFBTSxJQUMzQ0osUUFBUUksTUFBTSxDQUFDTCxHQUFHLENBQUMsQ0FBQ007Z0JBQ3BCLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRUEsS0FBSztZQUN0QyxLQUNBLEVBQUU7WUFFTCxPQUFPO2dCQUNOLEdBQUdMLE9BQU87Z0JBQ1ZDO1lBQ0Q7UUFDRDtRQUVBTixZQUFZRztRQUNaLE9BQU9BO0lBQ1IsRUFBRSxPQUFPUSxPQUFPO1FBQ2ZDLFFBQVFELEtBQUssQ0FBQyxtQ0FBbUNBO0lBQ2xEO0FBQ0Q7QUFFQSxpRUFBZVosYUFBYUEsRUFBQyIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxrYWxsYVxcT25lRHJpdmVcXERvY3VtZW50c1xcRGVjb2RpbmctU0VDXFxCZWFjaC1BbmQtQmFyLVdlYXJcXEZyb250RW5kXFxGZXRjaEZ1bmN0aW9uc1xcRmV0Y2hQcm9kdWN0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGZvcm1hdCAqL1xyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdEltcG9ydHNcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcclxuXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0XHRcdFx0XHRcdEZldGNoIEZ1bmN0aW9uXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vL0ZldGNocyB0aGUgcHJvZHVjdHMgYnV0IGFsc28gY29udmVydHMgaW1hZ2VzIGZyb20gYnl0ZWEgdG8gQkxPQiBVUkxzXHJcbi8vU2V0IHByb2R1Y3RzID0gdXNlU3RhdGUgc2V0dGVyIGZ1bmN0aW9uIGZvciBhbGwgcHJvZHVjdHNcclxuY29uc3QgZmV0Y2hQcm9kdWN0cyA9IGFzeW5jIChzZXRQcm9kdWN0cykgPT4ge1xyXG5cdHRyeSB7XHJcblx0XHRjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGF4aW9zLmdldChcImh0dHBzOi8vYmVhY2hhbmRiYXJ3ZWFyLmNvbS9mZXRjaEFsbFByb2R1Y3RzXCIpO1xyXG5cclxuXHRcdGNvbnN0IHJlYWR5ID0gZGF0YS5tYXAoKHByb2R1Y3QpID0+IHtcclxuXHRcdFx0Ly9DaGVja3MgaWYgcHJvZHVjdC5pbWFnZXMgaXMgYWN0dWFsbHkgYW4gYXJyYXlcclxuXHRcdFx0Ly9JZiBzby4uLiBmb3IgZWFjaCBiYXNlIDY0IHN0cmluZywgdHVybnMgaXQgaW50byBhIHVzYWJsZSBpbWFnZVxyXG5cdFx0XHQvL0lmIG5vdCBhbiBhcnJheSwgdGhlbiB0cmFuc2Zvcm1zIGl0IGludG8gYW4gZW1wdHkgYXJyYXlcclxuXHRcdFx0Y29uc3QgaW1hZ2VVcmxzID0gQXJyYXkuaXNBcnJheShwcm9kdWN0LmltYWdlcylcclxuXHRcdFx0XHQ/IHByb2R1Y3QuaW1hZ2VzLm1hcCgoYjY0KSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBgZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwke2I2NH1gO1xyXG5cdFx0XHRcdCAgfSlcclxuXHRcdFx0XHQ6IFtdO1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHQuLi5wcm9kdWN0LFxyXG5cdFx0XHRcdGltYWdlVXJscyxcclxuXHRcdFx0fTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNldFByb2R1Y3RzKHJlYWR5KTtcclxuXHRcdHJldHVybiByZWFkeTtcclxuXHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGFsbCBwcm9kdWN0IGRhdGFcIiwgZXJyb3IpO1xyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZldGNoUHJvZHVjdHM7XHJcbiJdLCJuYW1lcyI6WyJheGlvcyIsImZldGNoUHJvZHVjdHMiLCJzZXRQcm9kdWN0cyIsImRhdGEiLCJnZXQiLCJyZWFkeSIsIm1hcCIsInByb2R1Y3QiLCJpbWFnZVVybHMiLCJBcnJheSIsImlzQXJyYXkiLCJpbWFnZXMiLCJiNjQiLCJlcnJvciIsImNvbnNvbGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./FetchFunctions/FetchProducts.js\n");

/***/ }),

/***/ "(pages-dir-node)/./GlobalContext.jsx":
/*!***************************!*\
  !*** ./GlobalContext.jsx ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GlobalContext: () => (/* binding */ GlobalContext),\n/* harmony export */   GlobalProvider: () => (/* binding */ GlobalProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FetchFunctions/FetchProducts.js */ \"(pages-dir-node)/./FetchFunctions/FetchProducts.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__]);\n_FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/** @format */ /*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\t\tImports\r\n----------------------------------------------------------------------------------------------*/ \n\n//Fetch Imports\n\n/*---------------------------------------------------------------------------------------------\r\n\t\t\t\t\t\t\t\t\tGlobal Context\r\n----------------------------------------------------------------------------------------------*/ /*\r\nAllows us to store data globally, not just in one component.\r\nCan access and update that data from anywhere in our component tree.\r\nIts state will persist across different pages and routes.\r\nIn other words, it will not be lost on navigation via routes.\r\nPerfect for:\r\n - Logged in user info\r\n - Shopping cart contents\r\n - Preferences\r\n*/ const GlobalContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst GlobalProvider = ({ children })=>{\n    const [products, setProducts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [cart, setCart] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [isDayMode, setIsDayMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"GlobalProvider.useEffect\": ()=>{\n            const load = {\n                \"GlobalProvider.useEffect.load\": async ()=>{\n                    setLoading(true);\n                    await (0,_FetchFunctions_FetchProducts_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(setProducts);\n                    setLoading(false);\n                }\n            }[\"GlobalProvider.useEffect.load\"];\n            load();\n        }\n    }[\"GlobalProvider.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(GlobalContext.Provider, {\n        value: {\n            products,\n            setProducts,\n            cart,\n            setCart,\n            loading,\n            isDayMode,\n            setIsDayMode\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\GlobalContext.jsx\",\n        lineNumber: 44,\n        columnNumber: 3\n    }, undefined);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL0dsb2JhbENvbnRleHQuanN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxZQUFZLEdBQ1o7OzhGQUU4RjtBQUNuQztBQUUzRCxlQUFlO0FBQytDO0FBQzlEOzs4RkFFOEYsR0FDOUY7Ozs7Ozs7OztBQVNBLEdBRU8sTUFBTUksOEJBQWdCSixvREFBYUEsR0FBRztBQUV0QyxNQUFNSyxpQkFBaUIsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDMUMsTUFBTSxDQUFDQyxVQUFVQyxZQUFZLEdBQUdQLCtDQUFRQSxDQUFDLEVBQUU7SUFDM0MsTUFBTSxDQUFDUSxTQUFTQyxXQUFXLEdBQUdULCtDQUFRQSxDQUFDO0lBRXZDLE1BQU0sQ0FBQ1UsTUFBTUMsUUFBUSxHQUFHWCwrQ0FBUUEsQ0FBQyxFQUFFO0lBRW5DLE1BQU0sQ0FBQ1ksV0FBV0MsYUFBYSxHQUFHYiwrQ0FBUUEsQ0FBQztJQUUzQ0MsZ0RBQVNBO29DQUFDO1lBQ1QsTUFBTWE7aURBQU87b0JBQ1pMLFdBQVc7b0JBQ1gsTUFBTVAsNEVBQWFBLENBQUNLO29CQUNwQkUsV0FBVztnQkFDWjs7WUFFQUs7UUFDRDttQ0FBRyxFQUFFO0lBRUwscUJBQ0MsOERBQUNYLGNBQWNZLFFBQVE7UUFDdEJDLE9BQU87WUFBRVY7WUFBVUM7WUFBYUc7WUFBTUM7WUFBU0g7WUFBU0k7WUFBV0M7UUFBYTtrQkFFL0VSOzs7Ozs7QUFHSixFQUFFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGthbGxhXFxPbmVEcml2ZVxcRG9jdW1lbnRzXFxEZWNvZGluZy1TRUNcXEJlYWNoLUFuZC1CYXItV2VhclxcRnJvbnRFbmRcXEdsb2JhbENvbnRleHQuanN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKiBAZm9ybWF0ICovXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0SW1wb3J0c1xyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuLy9GZXRjaCBJbXBvcnRzXHJcbmltcG9ydCBmZXRjaFByb2R1Y3RzIGZyb20gXCIuL0ZldGNoRnVuY3Rpb25zL0ZldGNoUHJvZHVjdHMuanNcIjtcclxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHRcdFx0XHRcdFx0R2xvYmFsIENvbnRleHRcclxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qXHJcbkFsbG93cyB1cyB0byBzdG9yZSBkYXRhIGdsb2JhbGx5LCBub3QganVzdCBpbiBvbmUgY29tcG9uZW50LlxyXG5DYW4gYWNjZXNzIGFuZCB1cGRhdGUgdGhhdCBkYXRhIGZyb20gYW55d2hlcmUgaW4gb3VyIGNvbXBvbmVudCB0cmVlLlxyXG5JdHMgc3RhdGUgd2lsbCBwZXJzaXN0IGFjcm9zcyBkaWZmZXJlbnQgcGFnZXMgYW5kIHJvdXRlcy5cclxuSW4gb3RoZXIgd29yZHMsIGl0IHdpbGwgbm90IGJlIGxvc3Qgb24gbmF2aWdhdGlvbiB2aWEgcm91dGVzLlxyXG5QZXJmZWN0IGZvcjpcclxuIC0gTG9nZ2VkIGluIHVzZXIgaW5mb1xyXG4gLSBTaG9wcGluZyBjYXJ0IGNvbnRlbnRzXHJcbiAtIFByZWZlcmVuY2VzXHJcbiovXHJcblxyXG5leHBvcnQgY29uc3QgR2xvYmFsQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBHbG9iYWxQcm92aWRlciA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuXHRjb25zdCBbcHJvZHVjdHMsIHNldFByb2R1Y3RzXSA9IHVzZVN0YXRlKFtdKTtcclxuXHRjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuXHJcblx0Y29uc3QgW2NhcnQsIHNldENhcnRdID0gdXNlU3RhdGUoW10pO1xyXG5cclxuXHRjb25zdCBbaXNEYXlNb2RlLCBzZXRJc0RheU1vZGVdID0gdXNlU3RhdGUodHJ1ZSk7XHJcblxyXG5cdHVzZUVmZmVjdCgoKSA9PiB7XHJcblx0XHRjb25zdCBsb2FkID0gYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRzZXRMb2FkaW5nKHRydWUpO1xyXG5cdFx0XHRhd2FpdCBmZXRjaFByb2R1Y3RzKHNldFByb2R1Y3RzKTtcclxuXHRcdFx0c2V0TG9hZGluZyhmYWxzZSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdGxvYWQoKTtcclxuXHR9LCBbXSk7XHJcblxyXG5cdHJldHVybiAoXHJcblx0XHQ8R2xvYmFsQ29udGV4dC5Qcm92aWRlclxyXG5cdFx0XHR2YWx1ZT17eyBwcm9kdWN0cywgc2V0UHJvZHVjdHMsIGNhcnQsIHNldENhcnQsIGxvYWRpbmcsIGlzRGF5TW9kZSwgc2V0SXNEYXlNb2RlIH19XHJcblx0XHQ+XHJcblx0XHRcdHtjaGlsZHJlbn1cclxuXHRcdDwvR2xvYmFsQ29udGV4dC5Qcm92aWRlcj5cclxuXHQpO1xyXG59O1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiZmV0Y2hQcm9kdWN0cyIsIkdsb2JhbENvbnRleHQiLCJHbG9iYWxQcm92aWRlciIsImNoaWxkcmVuIiwicHJvZHVjdHMiLCJzZXRQcm9kdWN0cyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiY2FydCIsInNldENhcnQiLCJpc0RheU1vZGUiLCJzZXRJc0RheU1vZGUiLCJsb2FkIiwiUHJvdmlkZXIiLCJ2YWx1ZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./GlobalContext.jsx\n");

/***/ }),

/***/ "(pages-dir-node)/./Styles/ButtonAndCartSection.css":
/*!*****************************************!*\
  !*** ./Styles/ButtonAndCartSection.css ***!
  \*****************************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/HomePage.css":
/*!*****************************!*\
  !*** ./Styles/HomePage.css ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/LandingPage.css":
/*!********************************!*\
  !*** ./Styles/LandingPage.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/NavigationBar.css":
/*!**********************************!*\
  !*** ./Styles/NavigationBar.css ***!
  \**********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/OrderConfirmationPage.css":
/*!******************************************!*\
  !*** ./Styles/OrderConfirmationPage.css ***!
  \******************************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/PaymentPage.css":
/*!********************************!*\
  !*** ./Styles/PaymentPage.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/ProductCard.css":
/*!********************************!*\
  !*** ./Styles/ProductCard.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/ViewCartPage.css":
/*!*********************************!*\
  !*** ./Styles/ViewCartPage.css ***!
  \*********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/ViewProductPage.css":
/*!************************************!*\
  !*** ./Styles/ViewProductPage.css ***!
  \************************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./Styles/globals.css":
/*!****************************!*\
  !*** ./Styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./pages/_app.jsx":
/*!************************!*\
  !*** ./pages/_app.jsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Styles/globals.css */ \"(pages-dir-node)/./Styles/globals.css\");\n/* harmony import */ var _Styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _Styles_LandingPage_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Styles/LandingPage.css */ \"(pages-dir-node)/./Styles/LandingPage.css\");\n/* harmony import */ var _Styles_LandingPage_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Styles_LandingPage_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Styles_HomePage_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Styles/HomePage.css */ \"(pages-dir-node)/./Styles/HomePage.css\");\n/* harmony import */ var _Styles_HomePage_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Styles_HomePage_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _Styles_ViewProductPage_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Styles/ViewProductPage.css */ \"(pages-dir-node)/./Styles/ViewProductPage.css\");\n/* harmony import */ var _Styles_ViewProductPage_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Styles_ViewProductPage_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _Styles_ViewCartPage_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Styles/ViewCartPage.css */ \"(pages-dir-node)/./Styles/ViewCartPage.css\");\n/* harmony import */ var _Styles_ViewCartPage_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Styles_ViewCartPage_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _Styles_PaymentPage_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Styles/PaymentPage.css */ \"(pages-dir-node)/./Styles/PaymentPage.css\");\n/* harmony import */ var _Styles_PaymentPage_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_Styles_PaymentPage_css__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _Styles_OrderConfirmationPage_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Styles/OrderConfirmationPage.css */ \"(pages-dir-node)/./Styles/OrderConfirmationPage.css\");\n/* harmony import */ var _Styles_OrderConfirmationPage_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_Styles_OrderConfirmationPage_css__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _Styles_ButtonAndCartSection_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Styles/ButtonAndCartSection.css */ \"(pages-dir-node)/./Styles/ButtonAndCartSection.css\");\n/* harmony import */ var _Styles_ButtonAndCartSection_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_Styles_ButtonAndCartSection_css__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _Styles_NavigationBar_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Styles/NavigationBar.css */ \"(pages-dir-node)/./Styles/NavigationBar.css\");\n/* harmony import */ var _Styles_NavigationBar_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_Styles_NavigationBar_css__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _Styles_ProductCard_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Styles/ProductCard.css */ \"(pages-dir-node)/./Styles/ProductCard.css\");\n/* harmony import */ var _Styles_ProductCard_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_Styles_ProductCard_css__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/script */ \"(pages-dir-node)/./node_modules/next/script.js\");\n/* harmony import */ var next_script__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_script__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var _GlobalContext__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../GlobalContext */ \"(pages-dir-node)/./GlobalContext.jsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_GlobalContext__WEBPACK_IMPORTED_MODULE_12__]);\n_GlobalContext__WEBPACK_IMPORTED_MODULE_12__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/** @format */ /*---------------------------------------------------------------------------------------------\r\n                                        Imports\r\n----------------------------------------------------------------------------------------------*/ // Global CSS\n\n\n\n\n\n\n\n\n\n\n\n\n// Global Context\n\n/*---------------------------------------------------------------------------------------------\r\n                                        Main App\r\n----------------------------------------------------------------------------------------------*/ function App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_script__WEBPACK_IMPORTED_MODULE_11___default()), {\n                src: \"https://js.stripe.com/v3/\",\n                strategy: \"beforeInteractive\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\pages\\\\_app.jsx\",\n                lineNumber: 28,\n                columnNumber: 4\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_GlobalContext__WEBPACK_IMPORTED_MODULE_12__.GlobalProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\pages\\\\_app.jsx\",\n                    lineNumber: 30,\n                    columnNumber: 5\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\kalla\\\\OneDrive\\\\Documents\\\\Decoding-SEC\\\\Beach-And-Bar-Wear\\\\FrontEnd\\\\pages\\\\_app.jsx\",\n                lineNumber: 29,\n                columnNumber: 4\n            }, this)\n        ]\n    }, void 0, true);\n} //<Script src=\"https://js.stripe.com/v3/\" strategy=\"beforeInteractive\" />\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsWUFBWSxHQUNaOzs4RkFFOEYsR0FDOUYsYUFBYTs7QUFDa0I7QUFDSTtBQUNIO0FBQ087QUFDSDtBQUNEO0FBQ1U7QUFDRDtBQUNQO0FBQ0Y7QUFFRjtBQUVqQyxpQkFBaUI7QUFDaUM7QUFFbEQ7OzhGQUU4RixHQUMvRSxTQUFTRSxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ25ELHFCQUNDOzswQkFDQyw4REFBQ0oscURBQU1BO2dCQUFDSyxLQUFJO2dCQUE0QkMsVUFBUzs7Ozs7OzBCQUNqRCw4REFBQ0wsMkRBQWNBOzBCQUNkLDRFQUFDRTtvQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7O0FBSTVCLEVBRUEseUVBQXlFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGthbGxhXFxPbmVEcml2ZVxcRG9jdW1lbnRzXFxEZWNvZGluZy1TRUNcXEJlYWNoLUFuZC1CYXItV2VhclxcRnJvbnRFbmRcXHBhZ2VzXFxfYXBwLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGZvcm1hdCAqL1xyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSW1wb3J0c1xyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLy8gR2xvYmFsIENTU1xyXG5pbXBvcnQgXCIuLi9TdHlsZXMvZ2xvYmFscy5jc3NcIjtcclxuaW1wb3J0IFwiLi4vU3R5bGVzL0xhbmRpbmdQYWdlLmNzc1wiO1xyXG5pbXBvcnQgXCIuLi9TdHlsZXMvSG9tZVBhZ2UuY3NzXCI7XHJcbmltcG9ydCBcIi4uL1N0eWxlcy9WaWV3UHJvZHVjdFBhZ2UuY3NzXCI7XHJcbmltcG9ydCBcIi4uL1N0eWxlcy9WaWV3Q2FydFBhZ2UuY3NzXCI7XHJcbmltcG9ydCBcIi4uL1N0eWxlcy9QYXltZW50UGFnZS5jc3NcIjtcclxuaW1wb3J0IFwiLi4vU3R5bGVzL09yZGVyQ29uZmlybWF0aW9uUGFnZS5jc3NcIjtcclxuaW1wb3J0IFwiLi4vU3R5bGVzL0J1dHRvbkFuZENhcnRTZWN0aW9uLmNzc1wiO1xyXG5pbXBvcnQgXCIuLi9TdHlsZXMvTmF2aWdhdGlvbkJhci5jc3NcIjtcclxuaW1wb3J0IFwiLi4vU3R5bGVzL1Byb2R1Y3RDYXJkLmNzc1wiO1xyXG5cclxuaW1wb3J0IFNjcmlwdCBmcm9tIFwibmV4dC9zY3JpcHRcIjtcclxuXHJcbi8vIEdsb2JhbCBDb250ZXh0XHJcbmltcG9ydCB7IEdsb2JhbFByb3ZpZGVyIH0gZnJvbSBcIi4uL0dsb2JhbENvbnRleHRcIjtcclxuXHJcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYWluIEFwcFxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xyXG5cdHJldHVybiAoXHJcblx0XHQ8PlxyXG5cdFx0XHQ8U2NyaXB0IHNyYz1cImh0dHBzOi8vanMuc3RyaXBlLmNvbS92My9cIiBzdHJhdGVneT1cImJlZm9yZUludGVyYWN0aXZlXCIgLz5cclxuXHRcdFx0PEdsb2JhbFByb3ZpZGVyPlxyXG5cdFx0XHRcdDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuXHRcdFx0PC9HbG9iYWxQcm92aWRlcj5cclxuXHRcdDwvPlxyXG5cdCk7XHJcbn1cclxuXHJcbi8vPFNjcmlwdCBzcmM9XCJodHRwczovL2pzLnN0cmlwZS5jb20vdjMvXCIgc3RyYXRlZ3k9XCJiZWZvcmVJbnRlcmFjdGl2ZVwiIC8+XHJcbiJdLCJuYW1lcyI6WyJTY3JpcHQiLCJHbG9iYWxQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInNyYyIsInN0cmF0ZWd5Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.jsx\n");

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
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.jsx")));
module.exports = __webpack_exports__;

})();