"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkw5_React"] = self["webpackChunkw5_React"] || []).push([["src_views_manage_Home_jsx"],{

/***/ "./src/views/manage/Home.jsx":
/*!***********************************!*\
  !*** ./src/views/manage/Home.jsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var _utils_request__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/request */ \"./src/utils/request.js\");\n/* harmony import */ var echarts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! echarts */ \"./node_modules/echarts/index.js\");\n\n\n\n\nclass Home extends react__WEBPACK_IMPORTED_MODULE_0__.Component {\n  state = {\n    companys: [],\n    data: []\n  };\n  getCompany = async () => {\n    const {\n      data\n    } = await _utils_request__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get('/question/sum');\n    let comp = data.data.map(item => {\n      return {\n        value: item.total,\n        name: item.company\n      };\n    });\n    this.setState({\n      data: data.data,\n      companys: comp\n    });\n  };\n\n  componentDidMount() {\n    this.getCompany();\n  }\n\n  componentDidUpdate() {\n    let myChart = echarts__WEBPACK_IMPORTED_MODULE_2__.init(this.div);\n    myChart.setOption({\n      title: {\n        text: 'Company',\n        subtext: 'questionTotal',\n        left: 'center'\n      },\n      tooltip: {\n        trigger: 'item'\n      },\n      legend: {\n        orient: 'vertical',\n        left: 'left'\n      },\n      series: [{\n        name: 'Access From',\n        type: 'pie',\n        radius: '50%',\n        data: this.state.companys,\n        emphasis: {\n          itemStyle: {\n            shadowBlur: 10,\n            shadowOffsetX: 0,\n            shadowColor: 'rgba(0, 0, 0, 0.5)'\n          }\n        }\n      }]\n    });\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", {\n      ref: el => this.div = el,\n      style: {\n        width: '100%',\n        height: '600px',\n        fontSize: '16px'\n      }\n    });\n  }\n\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);\n\n//# sourceURL=webpack://w5_React/./src/views/manage/Home.jsx?");

/***/ })

}]);