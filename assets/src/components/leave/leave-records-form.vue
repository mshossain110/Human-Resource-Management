<template>
<div class="metabox-holder hrm-leave-records-form-warp">
	<div class="postbox">

		<h2 class="hndle ui-sortable-handle">
			<span>Leave Form</span>
		</h2>

		<div class="inside">
			<div class="hrm-attendance-configuration" id="hrm-hidden-form">
				<form id="hrm-leave-records-form" class="hrm-leave-records-form" action="" @submit.prevent="createNewLeave()">
					<div v-if="leave_proxy" class="hrm-form-field hrm-leave-employee-search-wrap">
						<label>
							Employee
							<em>*</em>
						</label>

						<div class="hrm-multiselect">
							<hrm-multiselect 
					            select-label=""
					            selected-label="selected"
					            deselect-label=""
								v-model="selectedEmployee" 
								id="ajax" 
								label="display_name" 
								track-by="ID" 
								placeholder="Type to search" 
								open-direction="bottom" 
								:options="employees" 
								:multiple="false" 
								:searchable="true" 
								@input="changeEmployee"
								@search-change="asyncFind">
<!-- 
									<template slot="clear" scope="props">
										<div class="multiselect__clear" 
											v-if="selectedEmployee.length" 
											@mousedown.prevent.stop="clearAll(props.search)">
											
										</div>
									</template>-->
									<span slot="noResult">No user found.</span> 

							</hrm-multiselect>
             
					    </div>
					    <div class="hrm-clear"></div>
					</div>

					<div v-if="isManager" class="hrm-form-field ">
						<label for="">
							Others employee
							<em></em>
						</label>
						<span class="hrm-checkbox-wrap">
							<input v-model="leave_proxy"  type="checkbox" id="hrm-disable-leave-proxy-checkbox">
							<label for="hrm-disable-leave-proxy-checkbox" class="hrm-radio">Enable/Disable</label>
						</span>
						<span class="hrm-clear"></span>
						<span class="description">you can apply on behalf of others employee leave</span>
					</div>
					
					<div class="hrm-form-field hrm-leave-type-wrap" v-if="!disable_leave_type">
						<label>
							Leave Type
							<em>*</em>
						</label>
						<div class="hrm-multiselect">

					        <hrm-multiselect 
					            v-model="leave_type" 
					            :options="leave_types" 
					            :multiple="false" 
					            :close-on-select="true"
					            :clear-on-select="true"
					            :hide-selected="false"
					            :show-labels="true"
					            placeholder="Select leave type"
					            select-label=""
					            selected-label="selected"
					            deselect-label=""
					            :taggable="false"
					            label="name"
					            track-by="id"
					            :allow-empty="true"
					            @input="change_leve_type_statue()">

					        </hrm-multiselect>               
					    </div>
					    <div class="hrm-clear"></div>
					</div>

					<div v-if="isLeaveTypeEnable" class="hrm-form-field ">
						<label for="">
							Leave type
							<em></em>
						</label>
						<span class="hrm-checkbox-wrap">
							<input @change="onOff('disable_leave_type')" type="checkbox" id="hrm-disable-leave-type-checkbox">
							<label for="hrm-disable-leave-type-checkbox" class="hrm-radio">Enable/Disable</label>
						</span>
						<span class="hrm-clear"></span>
						<span class="description"></span>
					</div>

					<div class="hrm-form-field ">
						<label for="">
							Comments
							<em></em>
						</label>
						<span class="hrm-checkbox-wrap">
							<textarea v-model="comments"></textarea>
							<label for="hrm-disable-leave-type-checkbox" class="hrm-radio"></label>
						</span>
						<span class="hrm-clear"></span>
						<span class="description"></span>
					</div>

					<div class="hrm-form-field">
						<label>Leave Duration<em>*</em></label>
						<div><strong>To take leave just click the calendar date cell.</strong></div>
						<div v-hrm-leave-jquery-fullcalendar class="hrm-leave-jquery-fullcalendar">
							
						</div>
					</div>

					
					<input :disabled="is_leave_btn_disable"  type="submit" class="button hrm-button-primary button-primary" name="requst" value="Save changes">
					<a @click.prevent="showHideLeaveRecordsForm(false)" target="_blank" href="#" class="button hrm-button-secondary">Cancel</a>
				</form>
			</div>

		</div>
	</div>
</div>
</template>

<script>

	import records_directive from './leave-form-directive';
    import Mixin from './mixin'
	
	export default {
		data: function() {
			return {
				employees: [],
				apply_to: '',
				leave_type: '',
				leave_types: [],
				administrators: [],
				status: '',
				start_time: '',
				end_time: '',
				comments: '',
				emp_leave_with_type_record: [],
				work_week: [],
				leave_entitlements: [],
				apply_leave_date: [],
				calendar_evt_id: [],
				disable_leave_type: false,
				selectedEmployee: false,
				isLoading: false,
				leave_proxy: false,
				apply_emp_lev_records: [],
				is_leave_btn_disable: false,
				holidays: [],
				isLeaveTypeEnable: false,
				leaveCalendar: ''
			}
		},

		computed: {
			isManager () {
				return hrm_user_can('manage_leave');
			}
		},

		watch: {
			leave_proxy (proxy) {
				this.refresh();
				this.change_leve_type_statue();
			},
		},

		mixins: [Mixin],

		components: {
			'hrm-multiselect': hrm.Multiselect
		},

		created: function() {
			this.$on('hrm_date_picker', this.setDateTime);
			this.getSettings();
			this.getInitialData();
		},
		methods: {
			getSettings () {
				var self = this;
				var request = {
					data: {},
					success (res) {
						let roles = self.processRoles(res.roles);
						let role = hrm_user_can( 'manage_settings' ) ? 'hrm_manager' : HRM_Vars.user_role;

						if ( res.settings ) {
							res.settings.leave_types = res.settings.leave_types || [];
							if (res.settings.leave_types.indexOf( role ) != -1) {
								self.isLeaveTypeEnable = true;
							}
						}
						
					}
				}
				this.httpRequest('get_leave_form_settings', request);
			},

			changeEmployee: function() {
				this.refresh();
				this.change_leve_type_statue();
			},
			refresh () {
				this.leaveCalendar.refetchEvents();
			},
			getInitialData: function() {
				var request_data = {
	                _wpnonce: HRM_Vars.nonce,
	            },
	            self = this;

				wp.ajax.send('get_leave_records_init_data', {
	                data: request_data,
	                
	                success: function(res) {
						self.leave_types    = res.leave_types.data;
						self.administrators = res.apply_to;
						self.holidays = res.holidays;
	                },

	                error: function(res) {
	 
	                }
	            });
			},
			setDateTime: function(date) {
				if (date.field == 'datepicker_from') {
					this.from = date.date
				}

				if (date.field == 'datepicker_to') {
					this.to = date.date
				}
			},
			show_hide_new_leave_records_form: function(el) {
				var self = this;

				this.slideUp(el.target, function() {
					self.$store.commit('leave/isNewLeaveRecordsFormVisible', {is_visible: false});
				});
							
			},

			createNewLeave: function() {

				if( this.is_leave_btn_disable ) {
					return false;
				}

				if (!this.apply_leave_date.length) {
					// Display a success toast, with a title
		            hrm.Toastr.error('Please select your leave date');
					return false;
				}

				var self = this;
				
			    var request_data = {
	                comments: this.comments,
	                type: ! this.leave_type ? '0' : this.leave_type.id,
	                emp_id: ! this.selectedEmployee ? false : this.selectedEmployee.ID,
	                time: this.apply_leave_date,
	                disable_leave_type: this.disable_leave_type,
	                status: 1,
	                class: 'Leave',
	                method: 'create'
	            };

	            var form_data = {
	                data: request_data,

	                beforeSend: function(xhr) {
	                	self.is_leave_btn_disable = true;
	                	self.show_spinner = true;
	                	self.loadingStart(
	               			'hrm-leave-records-form',
	               			{animationClass: 'preloader-update-animation'}
	               		);
	                },
	                
	                success: function(res) {
	                	self.is_leave_btn_disable = false;
	                	self.show_spinner = false;
	                	self.loadingStop('hrm-leave-records-form');
	                    
	                    // Display a success toast, with a title
	                    hrm.Toastr.success(res.success);
	                    self.$store.commit('leave/afterCreateNewLeave', res.resource);
	                    self.showHideLeaveRecordsForm(false);

	                 //    hrm.Vue.nextTick(function() {
		                //     var tr = jQuery('.wp-list-table')
		                //     	.find('tbody tr:first-child');
		                    
		                //     self.newRecordEffect(tr);
	                	// })
	                },

	                error: function(res) {
	                	self.show_spinner = false;
	                	// Showing error
	                    res.error.map( function( value, index ) {
	                        hrm.Toastr.error(value);
	                    });
	                }
	            };

	            this.httpRequest('create_new_leave', form_data);
			},

			change_leve_type_statue: function() {
				var self = this;
				jQuery.each(this.calendar_evt_id, function(index, event_id) {
					self.leaveCalendar.removeEvents(event_id);
				});
				
				this.calendar_evt_id  = [];
	        	this.apply_leave_date = [];
			},

		    asyncFind (query) {
		    	var self = this;
		    	if (query.length < 3) {
		    		return [];
		    	}
				var start = this.leaveCalendar.view.start;
				var start = hrm.Moment(start._d).format('YYYY-MM-DD');
				var end   = this.leaveCalendar.view.end;
				var end   = hrm.Moment(end._d).format('YYYY-MM-DD');
		    	
		    	var http_data = {
		    		data: {
		    			user: query,
		    			start: start,
		    			end: end
		    		},
		    		type: 'POST',
		    		success (res) {
		    			console.log(res);
		    			self.employees = res;
		    		}
		    	};

		    	self.httpRequest('search_emp_leave_records', http_data);
		    },
		    clearAll () {
				this.selectedEmployee = []
		    },

		}
	}
</script>

<style>
	.hrm-leave-employee-search-wrap .multiselect__input, 
	.hrm-leave-employee-search-wrap .multiselect__input:focus,
	.hrm-leave-type-wrap .multiselect__input,
	.hrm-leave-type-wrap .multiselect__input:focus {
		top: -5px;
		border: none;
		box-shadow: none;
	}

	.hrm-leave-employee-search-wrap .multiselect__content,
	.hrm-leave-type-wrap .multiselect__content {
		margin-top: 0 !important;
		z-index: 99999 !important;
	}

	.hrm-leave-jquery-fullcalendar {
		margin-left: 21%;
		width: 50%;
	}
	.fc-center h2 {
		font-size: 14px !important;
		font-weight: 600 !important;
	}
</style>

