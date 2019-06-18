/**
 * InRelation SlaPolicy
 *
 * @package     InRelation
 *
 * @description InRelation scripts for SlaPolicy module
 * @license     YetiForce Public License 3.0
 * @author      Rafal Pospiech <r.pospiech@yetiforce.com>
 */
class SlaPolicy_InRelation_Js {
	/**
	 * Constructor
	 *
	 * @param   {jQuery}  container
	 */
	constructor(container) {
		this.container = container;
		this.policyType = Number(this.container.find('[name="policy_type"]:checked').val());
		this.targetModule = this.container.find('[name="target"]').val();
		this.businessHours = JSON.parse(this.container.find('.js-all-business-hours').val());
		this.conditionBuilders = [];
		this.conditionsBuildersContainers = [];
		this.registerEvents();
	}

	/**
	 * Hide all settings
	 *
	 * @return  {self}
	 */
	hideAll() {
		this.container.find('.js-sla-policy-template, .js-sla-policy-custom').addClass('d-none');
		return this;
	}

	/**
	 * Show template settings
	 *
	 * @return  {self}
	 */
	showTemplateSettings() {
		this.container.find('.js-sla-policy-template').removeClass('d-none');
		return this;
	}

	/**
	 * Show custom settings
	 *
	 * @return  {self}
	 */
	showCustomSettings() {
		this.container.find('.js-sla-policy-custom').removeClass('d-none');
		return this;
	}

	/**
	 * Get template table
	 * @param {Array} rows
	 *
	 * @returns {String} HTML
	 */
	getTemplateTableHtml(rows) {
		return `<div class="col-12"><table class="table js-sla-policy-template-table">
		<thead>
			<tr>
				<th></th>
				<th>${app.vtranslate('JS_POLICY_NAME')}</th>
				<th>${app.vtranslate('JS_OPERATIONAL_HOURS')}</th>
				<th>${app.vtranslate('JS_REACTION_TIME')}</th>
				<th>${app.vtranslate('JS_IDLE_TIME')}</th>
				<th>${app.vtranslate('JS_RESOLVE_TIME')}</th>
			</tr>
		</thead>
		<tbody>
		${rows
			.map(row => {
				return `<tr>
				<td><input type="radio" name="policy_id" value="${row.id}"${row.checked ? 'checked="checked"' : ''}></td>
				<td>${row.name}</td>
				<td>${row.operational_hours}</td>
				<td>${row.reaction_time}</td>
				<td>${row.idle_time}</td>
				<td>${row.resolve_time}</td>
			</tr>`;
			})
			.join('')}
		</tbody>
		</table>
		</div>`;
	}

	/**
	 * Load predefined sla policy templates
	 */
	loadTemplates() {
		const progress = jQuery.progressIndicator({
			position: 'html',
			blockInfo: {
				enabled: true
			}
		});
		AppConnector.request({
			module: 'SlaPolicy',
			action: 'TemplatesAjax',
			targetModule: this.targetModule,
			recordId: Number($('#recordId').val())
		}).done(data => {
			progress.progressIndicator({ mode: 'hide' });
			if (data.success) {
				this.container.find('.js-sla-policy-template--container').html(this.getTemplateTableHtml(data.result));
			}
		});
	}

	/**
	 * On policy type change event handler
	 */
	onPolicyTypeChange() {
		this.policyType = Number(this.container.find('[name="policy_type"]:checked').val());
		if (this.policyType === 1) {
			this.hideAll()
				.showTemplateSettings()
				.loadTemplates();
		} else if (this.policyType === 2) {
			this.hideAll().showCustomSettings();
		} else {
			this.hideAll();
		}
	}

	/**
	 * On submit event handler
	 *
	 * @param {Event} ev
	 */
	onSubmit(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		const policyType = Number(this.container.find('[name="policy_type"]:checked').val());
		if (policyType === 2 && !this.container.validationEngine('validate')) {
			return;
		}
		const progress = jQuery.progressIndicator({
			position: 'html',
			blockInfo: {
				enabled: true
			}
		});
		const params = this.container.serializeFormData();
		params.module = 'SlaPolicy';
		params.action = 'SaveAjax';
		params.targetModule = this.targetModule;
		params.recordId = $('#recordId').val();
		params.policyType = policyType;
		params.policyId = Number(this.container.find('[name="policy_id"]:checked').val());
		AppConnector.request({ data: params }).done(data => {
			progress.progressIndicator({ mode: 'hide' });
			if (Array.isArray(data.result)) {
				data.result.forEach((row, index) => {
					const rowElem = this.container.find('.js-custom-table-row').eq(index);
					rowElem.data('id', row.id);
					rowElem.find('.js-custom-row-id').val(row.id);
				});
			} else {
				$.each(this.container.find('.js-custom-table-row'), (index, rowElem) => {
					rowElem = $(rowElem);
					rowElem.data('id', 0);
					rowElem.find('.js-custom-row-id').val(0);
				});
			}
			Vtiger_Helper_Js.showPnotify({
				text: app.vtranslate('JS_SAVE_NOTIFY_OK'),
				type: 'success',
				animation: 'show'
			});
		});
	}

	/**
	 * Register add record button click
	 */
	registerAddRecordBtnClick() {
		this.container.find('.js-sla-policy-add-record-btn').on('click', e => {
			e.preventDefault();
			e.stopPropagation();
			const index = this.container.find('.js-custom-table-row').length;
			const row = $(`<tr data-id="0" class="js-custom-table-row">
			<td class="js-conditions-col">
				<input type="hidden" name="rowid[${index}]" value="0" class="js-custom-row-id" />
				<input type="hidden" name="conditions[${index}]" class="js-conditions-value" value="{}" data-js="container">
				${this.container.find('.js-conditions-template').html()}
			</td>
			<td>
				<select class="select2" name="business_hours[${index}][]" multiple data-validation-engine="validate[required,funcCall[Vtiger_Base_Validator_Js.invokeValidation]]">
				${this.businessHours
					.map(businessHours => {
						return `<option value="${businessHours.id}">${businessHours.name}</option>`;
					})
					.join('')}
				</select>
			</td>
			<td>
			<div class="d-flex">
				<div style="flex-grow:1">
					<div class="js-reaction-time-container">
						<label>${app.vtranslate('JS_REACTION_TIME')}</label>
						<div class="input-group time">
							<div style="width:226px"><input type="hidden" name="reaction_time[${index}]" class="c-time-period" value="1:d"></div>
						</div>
					</div>
					<div class="js-idle-time-container">
						<label>${app.vtranslate('JS_IDLE_TIME')}</label>
						<div class="input-group time">
							<div style="width:226px"><input type="hidden" name="idle_time[${index}]" class="c-time-period" value="1:d"></div>
						</div>
					</div>
					<div class="js-resolve-time-container">
						<label>${app.vtranslate('JS_RESOLVE_TIME')}</label>
						<div class="input-group time">
							<div style="width:226px"><input type="hidden" name="resolve_time[${index}]" class="c-time-period" value="1:d"></div>
						</div>
					</div>
				</div>
				<div style="flex-grow:0;" class="ml-2 border-left"><a href class="btn btn-danger js-delete-row-action ml-2"><span class="fas fa-trash-alt"></span></a></div>
			</div>
			</td>
			</tr>`);
			App.Fields.TimePeriod.register(row);
			this.registerDelBtnClick(row);
			App.Fields.Picklist.showSelect2ElementView(row.find('.select2'));
			this.registerConditionBuilder(
				row.find('.js-condition-builder').eq(0),
				this.container.find('.js-conditions-col').length
			);
			this.container.find('.js-custom-conditions-table tbody').append(row);
		});
	}

	/**
	 * Register delete button click
	 *
	 * @param {jQuery} container
	 */
	registerDelBtnClick(container) {
		container.find('.js-delete-row-action').on('click', e => {
			e.preventDefault();
			e.stopPropagation();
			const tr = $(e.target).closest('tr');
			const rowId = Number(tr.data('id'));
			if (!rowId) {
				tr.remove();
				return;
			}
			const progress = jQuery.progressIndicator({
				position: 'html',
				blockInfo: {
					enabled: true
				}
			});
			AppConnector.request({
				module: 'SlaPolicy',
				action: 'DeleteAjax',
				targetModule: this.targetModule,
				record: rowId,
				hash: tr.data('hash')
			}).done(data => {
				progress.progressIndicator({ mode: 'hide' });
				$(e.target)
					.closest('tr')
					.remove();
				Vtiger_Helper_Js.showPnotify({
					text: app.vtranslate('JS_SAVE_NOTIFY_OK'),
					type: 'success',
					animation: 'show'
				});
			});
		});
	}

	/**
	 * On condition change event
	 *
	 * @param   {Vtiger_ConditionBuilder_Js}  instance
	 */
	onConditionsChange(instance) {
		const index = this.conditionBuilders.indexOf(instance);
		this.conditionsBuildersContainers[index]
			.parent()
			.find('.js-conditions-value')
			.val(JSON.stringify(instance.getConditions()));
	}

	/**
	 * Register condition builder
	 *
	 * @param {jQuery} container
	 * @param {Number} index
	 */
	registerConditionBuilder(container, index) {
		this.conditionBuilders[index] = new Vtiger_ConditionBuilder_Js(
			container,
			this.targetModule,
			this.onConditionsChange.bind(this)
		);
		this.conditionBuilders[index].registerEvents();
		this.conditionsBuildersContainers[index] = container;
	}

	/**
	 * Register events
	 */
	registerEvents() {
		this.container.off('submit').on('submit', this.onSubmit.bind(this));
		this.container.find('.js-sla-policy-type-radio').on('click', e => this.onPolicyTypeChange());
		this.onPolicyTypeChange();
		App.Fields.TimePeriod.register(this.container);
		this.registerAddRecordBtnClick();
		this.registerDelBtnClick(this.container);
		$.each(this.container.find('.js-custom-conditions-table .js-condition-builder'), (index, col) => {
			this.registerConditionBuilder($(col), index);
		});
	}
}
$(document).ready(jQuery => {
	if ($('.js-sla-policy').length) {
		new SlaPolicy_InRelation_Js($('#detailView'));
	}
});
app.event.on('DetailView.Tab.AfterLoad', (event, data, instance) => {
	if (instance.detailViewForm.find('.js-sla-policy').length) {
		if ($('.js-sla-policy').length) {
			new SlaPolicy_InRelation_Js(instance.detailViewForm);
		}
	}
});
