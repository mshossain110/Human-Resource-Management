wpSpearHrm([8],{

/***/ 338:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	mixins: [HRMMixin.employee],
	props: {
		deleteCheckbox: {
			type: [Boolean],
			default() {
				return true;
			}
		},
		fields: {
			type: [Array],
			default() {
				return [];
			}
		}
	},

	data() {
		return {
			canSubmit: true,
			loading: false,
			deleteAllStatus: false,
			deletedId: []
		};
	},

	created() {
		this.getRecords();
	},

	computed: {
		records() {
			return this.$store.state[this.nameSpace].records;
		},
		pagination() {
			var pagination = this.$store.state[this.nameSpace].pagination;
			pagination['total_pages'] = Math.ceil(pagination.total / pagination.per_page);
			return pagination;
		}
	},

	watch: {
		deletedId() {
			this.$store.commit(this.nameSpace + '/setDeletedId', this.deletedId);
		},
		'$route'(to, from) {
			this.getRecords();
		}
	},
	methods: {
		filterEditField(fields) {
			return fields.filter(function (field) {
				return field.editable ? true : false;
			});
		},
		filterHeader(fields) {
			return fields.filter(function (field) {
				return typeof field.tableHead === 'undefined' ? false : true;
			});
		},
		printCellData(record, field) {
			if (typeof field.filterPrintData == 'undefined') {
				return record[field.name];
			}

			return field.filterPrintData(record[field.name]);
		},

		recordEditForm(record, status) {
			status = status || 'toggle';
			this.$store.commit(this.nameSpace + '/showHideEditForm', {
				id: record.id,
				status: status
			});
		},

		selfUpdate(record) {

			var self = this,
			    data = {};

			data['id'] = record.id;

			self.fields.forEach(function (field) {
				if (!field.editable) {
					return;
				}

				if (typeof field.filterEditingData != 'undefined') {
					data[field.name] = field.filterEditingData(record[field.name]);
				} else {
					data[field.name] = record[field.name];
				}
			});

			var args = {
				data: data,
				callback() {
					self.canSubmit = true;
					self.loading = false;
				}
			};

			if (!this.editFormValidation(self.fields, data)) {
				return false;
			}

			self.canSubmit = false;
			self.loading = true;

			this.updateRecord(args);
		},
		selfDelete(record) {
			var self = this;
			this.recordDelete([record.id], function () {
				var hasRecords = self.$store.state[self.nameSpace].records.length;
				var page = self.$route.params.current_page_number;
				if (!hasRecords && page > 1) {
					self.$router.push({
						params: {
							current_page_number: page - 1
						},
						query: self.$route.query
					});
				}

				if (!hasRecords && typeof self.pagination != 'undefined' && self.pagination.total_pages > 1) {

					self.getRecords();
				}
			});
		},
		deleteAll() {
			if (this.deleteAllStatus) {
				var deleted_id = [];

				this.$store.state[this.nameSpace].records.map(function (record) {
					deleted_id.push(record.id);
				});

				this.deletedId = deleted_id;
			} else {
				this.deletedId = [];
			}
		},

		actionCheckbox() {
			let records = this.$store.state[this.nameSpace].records;

			if (records.length == this.deletedId.length) {
				this.deleteAllStatus = true;
			} else {
				this.deleteAllStatus = false;
			}
		}
	}

});

/***/ }),

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__employee_table_vue__ = __webpack_require__(428);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_employee_form_vue__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__employee_form_fields__ = __webpack_require__(387);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
	mixins: [HRMMixin.employee],

	data() {

		return {
			search: {
				filter: 'active',
				name: this.$route.query.name
			},
			bulkAction: -1,
			fields: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__employee_form_fields__["a" /* FormFields */])(this)
		};
	},

	watch: {
		search: {
			handler(obj) {
				if (obj.name == '') {
					this.recordSearch();
				}
			},
			deep: true
		}
	},

	created() {
		var self = this;
		this.getDepartments({
			callback(departments) {
				var index = self.getIndex(self.fields, 'department', 'name');
				self.fields[index].options = departments.dept_drop_down;
			}
		});

		this.getDesignations({
			callback(designations) {
				var index = self.getIndex(self.fields, 'designation', 'name');
				self.fields[index].options = designations.data;
			}
		});

		this.getLocations({
			callback(location) {
				var index = self.getIndex(self.fields, 'location', 'name');
				self.fields[index].options = location.data;
			}
		});
	},

	computed: {
		isNewRecordFormActive() {
			return this.$store.state[this.nameSpace].isNewRecordFormActive;
		},

		total_experiance_page() {
			return 10;
		},

		pagination() {
			var pagination = this.$store.state[this.nameSpace].pagination;
			pagination['total_pages'] = Math.ceil(pagination.total / pagination.per_page);
			return pagination;
		}
	},
	components: {
		'hrm-table': __WEBPACK_IMPORTED_MODULE_0__employee_table_vue__["a" /* default */],
		'add-new-record-form': __WEBPACK_IMPORTED_MODULE_1__new_employee_form_vue__["a" /* default */]
	},

	methods: {

		selfBulkAction() {
			var self = this;
			switch (this.bulkAction) {
				case 'delete':
					this.recordDelete(self.$store.state[self.nameSpace].deletedId, function () {
						var hasRecords = self.$store.state[self.nameSpace].records.length;
						var page = self.$route.params.current_page_number;

						if (!hasRecords && page > 1) {
							self.$router.push({
								params: {
									current_page_number: page - 1
								},
								query: self.$route.query
							});
						}
						if (!hasRecords && self.pagination.total_pages > 1) {
							self.getRecords();
						}
					});
					break;

				default:

					break;
			}
		},

		recordSearch() {
			this.$router.push({ query: this.search });
		}
	}
});

/***/ }),

/***/ 340:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	mixins: [HRMMixin.employee],
	props: {
		fields: {
			type: [Array]
		}
	},

	data() {
		return {
			loading: false,
			canSubmit: true
		};
	},

	computed: {},

	methods: {
		selfNewRecord() {
			var self = this;
			var postData = this.generateFieldData(this.fields);

			if (!this.formValidation(this.fields, postData)) {
				return false;
			}

			var args = {
				data: postData,
				callback(success, res) {
					self.loading = false;
					self.canSubmit = true;
					self.showHideNewRecordForm(false);
					self.makeEmptyField(self.fields);
				}
			};

			self.loading = true;
			self.canSubmit = false;

			this.addNewRecord(args);
		},

		generateFieldData(data) {
			var formated = {};

			data.forEach(function (val) {
				if (typeof val.filterSubmited !== 'undefined') {
					formated[val.name] = val.filterSubmited(val.model);
				} else {
					formated[val.name] = val.model;
				}
			});

			return formated;
		},
		makeEmptyField(data) {
			data.forEach(function (val) {
				val.model = '';
			});
		}
	}
});

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FormFields; });
function FormFields(self) {
	return [{
		type: 'text',
		model: '',
		label: 'User Name',
		name: 'userName',
		//tableHead: 'Title',
		//tbRowAction: true,
		editable: false,
		required: true
	}, {
		type: 'email',
		model: '',
		label: 'Email',
		name: 'email',
		editable: false,
		required: true
	}, {
		type: 'text',
		model: '',
		label: 'First Name',
		name: 'firstName',
		editable: true,
		required: true
	}, {
		type: 'text',
		model: '',
		label: 'Last Name',
		name: 'lastName',
		editable: true,
		required: true
	}, {
		type: 'select',
		model: hrmGetDefaultRole(),
		options: hrmGetRoles(),
		label: 'Role',
		optionLabel: 'display_name',
		placeholder: 'Select Role',
		name: 'role',
		tableHead: 'Role',
		trackBy: 'name',
		editable: true,
		required: true,
		//Filter submited new data
		filterSubmited(val) {
			return val.name;
		},

		//Table print data
		filterPrintData(val) {
			if (!val) {
				return '&#8211 &#8211';
			}
			return val.display_name;
		},

		//Filter edit submited data
		filterEditingData(val) {
			if (val) {
				return val.name;
			}
		}
	}, {
		type: 'select',
		model: '',
		options: [],
		label: 'Department',
		optionLabel: 'name',
		placeholder: 'Select Department',
		name: 'department',
		tableHead: 'Department',
		editable: true,
		required: true,
		helpText: '<a href="#/departments">Create Department</a>',
		//Filter submited new data
		filterSubmited(val) {
			return val.id;
		},
		//Table print data
		filterPrintData(val) {
			if (!val) {
				return '&#8211 &#8211';
			}
			return val.data.name;
		},
		// Filter edit form field data
		filterComputedGet(val) {
			if (!val) {
				return '';
			}
			return val.data;
		},
		// Filer edit changable data
		filterComputedSet(val) {
			return { data: val };
		},
		//Filter edit submited data
		filterEditingData(val) {
			if (val) {
				return val.data.id;
			}
		}
	}, {
		type: 'select',
		model: '',
		options: [],
		label: 'Designation',
		optionLabel: 'title',
		placeholder: 'Select Designation',
		name: 'designation',
		tableHead: 'Designation',
		editable: true,
		required: true,
		helpText: '<a href="#/designation">Create Designation</a>',
		//Filter submited new data
		filterSubmited(val) {
			return val.id;
		},
		//Table print data
		filterPrintData(val) {

			if (!val) {
				return '&#8211 &#8211';
			}
			return val.data.title;
		},
		// Filter edit form field data
		filterComputedGet(val) {

			if (!val) {
				return '';
			}
			return val.data;
		},
		// Filer edit changable data
		filterComputedSet(val) {
			return { data: val };
		},
		//Filter edit submited data
		filterEditingData(val) {
			if (val) {
				return val.data.id;
			}
		}
	}, {
		type: 'select',
		model: '',
		options: [],
		label: 'Location',
		optionLabel: 'name',
		placeholder: 'Select Location',
		name: 'location',
		tableHead: 'Location',
		editable: true,
		helpText: '<a href="#/organization/location">Create Location</a>',
		//Filter submited new data
		filterSubmited(val) {
			return val.id;
		},
		//Table print data
		filterPrintData(val) {

			if (!val) {
				return '&#8211 &#8211';
			}
			return val.data.name;
		},
		// Filter edit form field data
		filterComputedGet(val) {

			if (!val) {
				return '';
			}
			return val.data;
		},
		// Filer edit changable data
		filterComputedSet(val) {
			return { data: val };
		},
		//Filter edit submited data
		filterEditingData(val) {
			if (val) {
				return val.data.id;
			}
		}

	}, {
		type: 'select',
		model: hrmGetDefaultStatus(),
		options: hrmGetStatus(),
		label: 'Status',
		optionLabel: 'label',
		placeholder: 'Select Status',
		name: 'status',
		tableHead: 'Status',
		editable: true,
		//Filter submited new data
		filterSubmited(val) {
			return val.key;
		},
		//Filter edit submited data
		filterEditingData(val) {
			return val.key;
		},
		//Table print data
		filterPrintData(val) {

			if (!val) {
				return '&#8211 &#8211';
			}
			return val.label;
		}

	}, {
		type: 'select',
		model: '',
		options: hrmGetGender(),
		label: 'Gender',
		optionLabel: 'label',
		placeholder: 'Select Gender',
		name: 'gender',
		tableHead: 'Gender',
		editable: true,
		//Filter submited new data
		filterSubmited(val) {
			return val.key;
		},
		//Filter edit submited data
		filterEditingData(val) {
			return val ? val.key : '';
		},
		//Table print data
		filterPrintData(val) {

			if (!val) {
				return '&#8211 &#8211';
			}
			return val.label;
		}
	}, {
		type: 'text',
		model: '',
		label: 'Mobile Number',
		name: 'mobileNumber',
		editable: true
	}, {
		type: 'datePickerFrom',
		model: '',
		label: 'Joining Date',
		name: 'joiningDate',
		editable: true
	}, {
		type: 'textarea',
		model: '',
		label: 'Description',
		name: 'description',
		tableHead: 'Description',
		editable: true
	}, {
		type: 'file',
		model: [],
		label: 'Profile Picture',
		name: 'employee_image',
		editMode: false,
		multiple: false,
		deleted_files: [],
		attr: {
			height: '80px',
			width: '80px'
		},
		default: []
	}];
}

function hrmGetGender() {
	return [{
		key: 1,
		label: 'Male'
	}, {
		key: 2,
		label: 'Female'
	}, {
		key: 3,
		label: 'Others'
	}];
}

function hrmGetStatus() {
	return [{
		key: 1,
		label: 'Active'
	}, {
		key: 2,
		label: 'Disable'
	}];
}

function hrmGetRoles() {
	var roles = [];

	jQuery.each(HRM_Vars.hrm_roles, function (key, val) {
		roles.push({
			name: key,
			display_name: val
		});
	});

	return roles;
}

function hrmGetDefaultRole() {
	var role = {};

	jQuery.each(HRM_Vars.hrm_roles, function (key, val) {
		if (key == 'hrm_employee') {
			role = {
				name: key,
				display_name: val
			};
		}
	});

	return role;
}

function hrmGetDefaultStatus() {
	return {
		key: 1,
		label: 'Active'
	};
}



/***/ }),

/***/ 399:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.hrm-bulk-wrap, .hrm-filter-wrap {\n\tfloat: left;\n}\n.hrm-tbl-action-wrap {\n\tmargin-top: 20px;\n}\n", ""]);

// exports


/***/ }),

/***/ 419:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(false);
// imports


// module
exports.push([module.i, "\n.alignright {\n\tfloat: right;\n}\n.hrm-spinner {\n\tmargin-right: 10px;\n\tmargin-top: 6px;\n}\n.hrm-avatar,\n.hrm-profile-link {\n\tfloat: left;\n}\n.hrm-avatar {\n\tmargin-right: 5px;\n}\n.has-row-actions {\n\twidth: 16%;\n}\n\n", ""]);

// exports


/***/ }),

/***/ 428:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_employee_table_vue__ = __webpack_require__(338);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ebc3d820_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_employee_table_vue__ = __webpack_require__(515);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(546)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_employee_table_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ebc3d820_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_employee_table_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/components/employee/employee-table.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ebc3d820", Component.options)
  } else {
    hotAPI.reload("data-v-ebc3d820", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 429:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_employee_form_vue__ = __webpack_require__(340);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_65c495b6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_new_employee_form_vue__ = __webpack_require__(487);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_employee_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_65c495b6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_new_employee_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/components/employee/new-employee-form.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-65c495b6", Component.options)
  } else {
    hotAPI.reload("data-v-65c495b6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 470:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _vm.manageEmployee()
        ? _c("h1", { staticClass: "wp-heading-inline" }, [_vm._v("Employee")])
        : _vm._e(),
      _vm._v(" "),
      _vm.manageEmployee()
        ? _c(
            "a",
            {
              staticClass: "page-title-action",
              on: {
                click: function($event) {
                  $event.preventDefault()
                  _vm.showHideNewRecordForm("toggle")
                }
              }
            },
            [_vm._v("Add New")]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.isNewRecordFormActive && _vm.manageEmployee()
        ? _c("add-new-record-form", {
            staticClass: "hrm-toggle",
            attrs: { fields: _vm.fields }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "hrm-tbl-action-wrap" }, [
        _vm.manageEmployee()
          ? _c("div", { staticClass: "hrm-table-action hrm-bulk-wrap" }, [
              _c(
                "label",
                {
                  staticClass: "screen-reader-text",
                  attrs: { for: "bulk-action-selector-top" }
                },
                [_vm._v("\n\t\t\t\t\tSelect bulk action\n\t\t\t\t")]
              ),
              _vm._v(" "),
              _c(
                "select",
                {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.bulkAction,
                      expression: "bulkAction"
                    }
                  ],
                  attrs: { name: "action", id: "bulk-action-selector-top" },
                  on: {
                    change: function($event) {
                      var $$selectedVal = Array.prototype.filter
                        .call($event.target.options, function(o) {
                          return o.selected
                        })
                        .map(function(o) {
                          var val = "_value" in o ? o._value : o.value
                          return val
                        })
                      _vm.bulkAction = $event.target.multiple
                        ? $$selectedVal
                        : $$selectedVal[0]
                    }
                  }
                },
                [
                  _c("option", { attrs: { value: "-1" } }, [
                    _vm._v("Bulk Actions")
                  ]),
                  _vm._v(" "),
                  _c("option", { attrs: { value: "delete" } }, [
                    _vm._v("Delete")
                  ])
                ]
              ),
              _vm._v(" "),
              _c(
                "a",
                {
                  staticClass: "button hrm-button-secondary button-secondary",
                  attrs: { href: "#" },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.selfBulkAction()
                    }
                  }
                },
                [_vm._v("Apply")]
              )
            ])
          : _vm._e(),
        _vm._v(" "),
        _c("div", { staticClass: "hrm-table-action hrm-filter-wrap" }, [
          _c("div", { staticClass: "alignleft actions" }, [
            _c(
              "form",
              {
                on: {
                  submit: function($event) {
                    $event.preventDefault()
                    _vm.recordSearch()
                  }
                }
              },
              [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.search.name,
                      expression: "search.name"
                    }
                  ],
                  attrs: {
                    size: "40",
                    placeholder: "Search by user login, nicename, email",
                    type: "search"
                  },
                  domProps: { value: _vm.search.name },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.search, "name", $event.target.value)
                    }
                  }
                }),
                _vm._v(" "),
                _c("input", {
                  staticClass: "button hrm-button-secondary button-secondary",
                  attrs: { type: "submit", value: "Filter" }
                })
              ]
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "hrm-clear" })
      ]),
      _vm._v(" "),
      _c("hrm-table", {
        attrs: { id: "hrm-employee-list-table", fields: _vm.fields }
      }),
      _vm._v(" "),
      _c("hrm-pagination", {
        attrs: {
          total_pages: _vm.pagination.total_pages,
          component_name: "employee_pagination"
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-38baa9ef", esExports)
  }
}

/***/ }),

/***/ 487:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "metabox-holder" }, [
    _c(
      "div",
      { staticClass: "postbox", attrs: { id: "hrm-hidden-form-warp" } },
      [
        _c("h2", { staticClass: "hndle" }, [_vm._v("Employee")]),
        _vm._v(" "),
        _c("div", { staticClass: "inside" }, [
          _c(
            "form",
            {
              attrs: { id: "hrm-hidden-form", action: "" },
              on: {
                submit: function($event) {
                  $event.preventDefault()
                  _vm.selfNewRecord()
                }
              }
            },
            [
              _c(
                "div",
                { attrs: { id: "hrm-form-field" } },
                [_c("hrm-form-fields", { attrs: { fields: _vm.fields } })],
                1
              ),
              _vm._v(" "),
              _c("div", { staticClass: "hrm-action-wrap" }, [
                _c("input", {
                  staticClass: "button hrm-button-primary button-primary",
                  attrs: {
                    disabled: !_vm.canSubmit,
                    type: "submit",
                    name: "requst",
                    value: "Submit"
                  }
                }),
                _vm._v(" "),
                _c(
                  "a",
                  {
                    staticClass: "button hrm-button-secondary",
                    attrs: { target: "_blank", href: "#" },
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.showHideNewRecordForm(false)
                      }
                    }
                  },
                  [_vm._v("Cancel")]
                ),
                _vm._v(" "),
                _vm.loading
                  ? _c("div", { staticClass: "hrm-spinner" }, [
                      _vm._v("Saving....")
                    ])
                  : _vm._e()
              ])
            ]
          )
        ])
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-65c495b6", esExports)
  }
}

/***/ }),

/***/ 515:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm.isFetchRecord
      ? _c(
          "table",
          { staticClass: "wp-list-table widefat fixed striped pages" },
          [
            _c("thead", [
              _c(
                "tr",
                [
                  _vm.manageEmployee()
                    ? _c(
                        "td",
                        {
                          staticClass: "manage-column column-cb check-column",
                          attrs: { id: "cb" }
                        },
                        [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.deleteAllStatus,
                                expression: "deleteAllStatus"
                              }
                            ],
                            attrs: { id: "cb-select-all-1", type: "checkbox" },
                            domProps: {
                              checked: Array.isArray(_vm.deleteAllStatus)
                                ? _vm._i(_vm.deleteAllStatus, null) > -1
                                : _vm.deleteAllStatus
                            },
                            on: {
                              change: [
                                function($event) {
                                  var $$a = _vm.deleteAllStatus,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        (_vm.deleteAllStatus = $$a.concat([
                                          $$v
                                        ]))
                                    } else {
                                      $$i > -1 &&
                                        (_vm.deleteAllStatus = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)))
                                    }
                                  } else {
                                    _vm.deleteAllStatus = $$c
                                  }
                                },
                                function($event) {
                                  $event.preventDefault()
                                  _vm.deleteAll()
                                }
                              ]
                            }
                          })
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c("th", { staticClass: "has-row-actions" }, [
                    _vm._v("Name")
                  ]),
                  _vm._v(" "),
                  _vm._l(_vm.filterHeader(_vm.fields), function(
                    header,
                    header_index
                  ) {
                    return _c("th", { key: header_index }, [
                      _vm._v(
                        "\n                    \t" +
                          _vm._s(header.tableHead) +
                          "\n                    "
                      )
                    ])
                  })
                ],
                2
              )
            ]),
            _vm._v(" "),
            _c(
              "tbody",
              [
                _vm._l(_vm.records, function(record, record_index) {
                  return !record.editMode
                    ? _c(
                        "tr",
                        {
                          key: record_index,
                          attrs: { "data-recordId": record.id }
                        },
                        [
                          _vm.manageEmployee()
                            ? _c(
                                "th",
                                {
                                  staticClass: "check-column",
                                  attrs: { scope: "row" }
                                },
                                [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.deletedId,
                                        expression: "deletedId"
                                      }
                                    ],
                                    attrs: {
                                      id: "cb-select-7",
                                      type: "checkbox"
                                    },
                                    domProps: {
                                      value: record.id,
                                      checked: Array.isArray(_vm.deletedId)
                                        ? _vm._i(_vm.deletedId, record.id) > -1
                                        : _vm.deletedId
                                    },
                                    on: {
                                      change: [
                                        function($event) {
                                          var $$a = _vm.deletedId,
                                            $$el = $event.target,
                                            $$c = $$el.checked ? true : false
                                          if (Array.isArray($$a)) {
                                            var $$v = record.id,
                                              $$i = _vm._i($$a, $$v)
                                            if ($$el.checked) {
                                              $$i < 0 &&
                                                (_vm.deletedId = $$a.concat([
                                                  $$v
                                                ]))
                                            } else {
                                              $$i > -1 &&
                                                (_vm.deletedId = $$a
                                                  .slice(0, $$i)
                                                  .concat($$a.slice($$i + 1)))
                                            }
                                          } else {
                                            _vm.deletedId = $$c
                                          }
                                        },
                                        function($event) {
                                          _vm.actionCheckbox()
                                        }
                                      ]
                                    }
                                  })
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _c(
                            "td",
                            {},
                            [
                              _c("img", {
                                staticClass: "hrm-avatar",
                                staticStyle: { height: "32px", width: "32px" },
                                attrs: { src: record.avatar }
                              }),
                              _vm._v(" "),
                              _c(
                                "router-link",
                                {
                                  staticClass: "hrm-profile-link",
                                  attrs: {
                                    to: {
                                      name: "employee_general_information",
                                      params: {
                                        employeeId: record.id
                                      }
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n\t\t\t\t\t\t\t" +
                                      _vm._s(record.display_name) +
                                      "\n\t\t\t\t\t\t"
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c("div", { staticClass: "hrm-clear" }),
                              _vm._v(" "),
                              _c("div", { staticClass: "row-actions" }, [
                                _vm.manageEmployee() || record.can_update
                                  ? _c("span", { staticClass: "edit" }, [
                                      _c(
                                        "a",
                                        {
                                          attrs: { href: "#" },
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.recordEditForm(record)
                                            }
                                          }
                                        },
                                        [_vm._v("Edit")]
                                      )
                                    ])
                                  : _vm._e(),
                                _vm._v(" "),
                                _vm.manageEmployee()
                                  ? _c("span", { staticClass: "trash" }, [
                                      _vm._v(" | "),
                                      _c(
                                        "a",
                                        {
                                          attrs: { href: "#" },
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.selfDelete(record)
                                            }
                                          }
                                        },
                                        [_vm._v("Delete")]
                                      )
                                    ])
                                  : _vm._e()
                              ])
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _vm._l(_vm.filterHeader(_vm.fields), function(
                            field,
                            field_index
                          ) {
                            return _c("td", [
                              _c("span", {
                                domProps: {
                                  innerHTML: _vm._s(
                                    _vm.printCellData(record, field)
                                  )
                                }
                              })
                            ])
                          })
                        ],
                        2
                      )
                    : _c(
                        "tr",
                        {
                          staticClass: "inline-edit-row hrm-edit-toggle",
                          attrs: {
                            id: "hrm-edit-" + record.id,
                            "data-recordId": record.id
                          }
                        },
                        [
                          _c(
                            "td",
                            {
                              staticClass: "colspanchange",
                              attrs: { colspan: "9" }
                            },
                            [
                              _c(
                                "form",
                                {
                                  staticClass: "hrm-edit-form",
                                  attrs: {
                                    id: "hrm-edit-form-" + record.id,
                                    action: ""
                                  },
                                  on: {
                                    submit: function($event) {
                                      $event.preventDefault()
                                      _vm.selfUpdate(record)
                                    }
                                  }
                                },
                                [
                                  _c(
                                    "fieldset",
                                    { staticClass: "inline-edit-col-left" },
                                    [
                                      _c(
                                        "legend",
                                        { staticClass: "inline-edit-legend" },
                                        [_vm._v("Quick Edit")]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        { staticClass: "inline-edit-col" },
                                        _vm._l(
                                          _vm.filterEditField(_vm.fields),
                                          function(field, field_index) {
                                            return _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "hrm-edit-field-wrap"
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "title" },
                                                  [
                                                    _vm._v(
                                                      "\n\t\t\t\t\t\t\t\t\t\t\t" +
                                                        _vm._s(field.label) +
                                                        " "
                                                    ),
                                                    field.required
                                                      ? _c("em", [_vm._v("*")])
                                                      : _vm._e()
                                                  ]
                                                ),
                                                _vm._v(" "),
                                                _c(
                                                  "span",
                                                  {
                                                    staticClass:
                                                      "input-text-wrap"
                                                  },
                                                  [
                                                    _c("hrm-edit-field", {
                                                      attrs: {
                                                        record: record,
                                                        field: field
                                                      }
                                                    })
                                                  ],
                                                  1
                                                ),
                                                _vm._v(" "),
                                                _c("div", {
                                                  staticClass: "hrm-clear"
                                                })
                                              ]
                                            )
                                          }
                                        )
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _vm._m(0),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "submit inline-edit-save" },
                                    [
                                      _c(
                                        "button",
                                        {
                                          staticClass:
                                            "button hrm-button-secondary cancel alignleft",
                                          attrs: { type: "button" },
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.recordEditForm(record, false)
                                            }
                                          }
                                        },
                                        [_vm._v("Cancel")]
                                      ),
                                      _vm._v(" "),
                                      _c("input", {
                                        staticClass:
                                          "button hrm-button-primary button-primary save alignright",
                                        attrs: {
                                          disabled: !_vm.canSubmit,
                                          type: "submit",
                                          value: "Update"
                                        }
                                      }),
                                      _vm._v(" "),
                                      _vm.loading
                                        ? _c("div", {
                                            staticClass:
                                              "hrm-spinner alignright"
                                          })
                                        : _vm._e(),
                                      _vm._v(" "),
                                      _c("br", { staticClass: "clear" })
                                    ]
                                  )
                                ]
                              )
                            ]
                          )
                        ]
                      )
                }),
                _vm._v(" "),
                !_vm.records.length
                  ? _c("tr", [
                      _c("td", { attrs: { colspan: "9" } }, [
                        _vm._v("\n\t\t\t\t\t\tNo result found!\n\t\t\t\t\t")
                      ])
                    ])
                  : _vm._e()
              ],
              2
            )
          ]
        )
      : _vm._e()
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("fieldset", { staticClass: "inline-edit-col-right" }, [
      _c("div", { staticClass: "inline-edit-col" })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-ebc3d820", esExports)
  }
}

/***/ }),

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(399);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("938f1d8e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-38baa9ef\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./employee.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-38baa9ef\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./employee.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 546:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(419);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("5b2e88ce", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ebc3d820\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./employee-table.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ebc3d820\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./employee-table.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_employee_vue__ = __webpack_require__(339);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_38baa9ef_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_employee_vue__ = __webpack_require__(470);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(526)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_employee_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_38baa9ef_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_employee_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/components/employee/employee.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-38baa9ef", Component.options)
  } else {
    hotAPI.reload("data-v-38baa9ef", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ })

});