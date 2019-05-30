{*<!-- {[The file is published on the basis of YetiForce Public License 3.0 that can be found in the following directory: licenses/LicenseEN.txt or yetiforce.com]} -->*}
{strip}
<!-- tpl-Settings-BusinessHours-EditViewBlocks -->
<div class="verticalScroll">
	<div class="editViewContainer">
		<form class="form-horizontal recordEditView" id="EditView" name="EditView" method="post" action="index.php" enctype="multipart/form-data">
				<input type="hidden" name="module" value="{$MODULE}"/>
				<input type="hidden" name="parent" value="{$PARENT_MODULE}"/>
				<input type="hidden" value="{$VIEW}" name="view"/>
				<input type="hidden" name="action" value="Save"/>
			{if !empty($RECORD_ID)}
				<input type="hidden" name="record" id="recordId" value="{$RECORD_ID}"/>
			{/if}
			<div class="widget_header row mb-3">
				<div class="col-md-8">
					{include file=\App\Layout::getTemplatePath('BreadCrumbs.tpl', $QUALIFIED_MODULE)}
				</div>
			</div>
			<div class="card">
				<div class="card-header">{if !empty($RECORD_MODEL->getId())}{\App\Language::translate('LBL_EDIT_BUSINESS_HOURS',$QUALIFIED_MODULE)} - {$RECORD_MODEL->getName()}{else}{\App\Language::translate('LBL_ADD_BUSINESS_HOURS',$QUALIFIED_MODULE)}{/if}</div>
				<div class="card-body">
					<div class="row mb-3">
						<div class="col-sm-12 col-md-6 col-lg-3 form-group">
							<label>{\App\Language::translate('LBL_NAME', $QUALIFIED_MODULE)}</label>
							<input
							type="text"
							name="businesshoursname"
							class="form-control w-100"{if isset($RECORD_MODEL)} value="{$RECORD_MODEL->getName()}"{/if}
							data-validation-engine="validate[required,funcCall[Vtiger_Base_Validator_Js.invokeValidation]]"
							>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-3 form-group">
							<label>{\App\Language::translate('LBL_WORKING_DAYS', $QUALIFIED_MODULE)}</label>
							<select class="select2" name="working_days[]" multiple="multiple" data-tags="true" data-validation-engine="validate[required,funcCall[Vtiger_Base_Validator_Js.invokeValidation]]">
								{foreach item="DAY_NAME" key="DAY_ID" from=$DAYS_OF_THE_WEEK}
									<option value="{$DAY_ID}"{if strpos($RECORD_MODEL->get('working_days'),(string)$DAY_ID)!==false} selected="selected"{/if}>{\App\Language::translate($DAY_NAME,'Calendar')}</option>
								{/foreach}
							</select>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-2 form-group">
							<label>{\App\Language::translate('LBL_WORKING_HOURS_FROM', $QUALIFIED_MODULE)}</label>
							<div class="input-group time">
								<input id="hours_from" type="text" data-format="{$USER_MODEL->get('hour_format')}"
										class="clockPicker form-control" value="{\App\Fields\Time::formatToDisplay($RECORD_MODEL->get('working_hours_from'))}"
										title="{\App\Language::translate('LBL_WORKING_HOURS_FROM', $QUALIFIED_MODULE)}"
										name="working_hours_from"
										data-validation-engine="validate[required,funcCall[Vtiger_Base_Validator_Js.invokeValidation]]"
										autocomplete="off"/>
								<div class="input-group-append">
									<span class="input-group-text u-cursor-pointer js-clock__btn" data-js="click">
										<span class="far fa-clock"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-2 form-group">
							<label>{\App\Language::translate('LBL_WORKING_HOURS_TO', $QUALIFIED_MODULE)}</label>
							<div class="input-group time">
								<input id="hours_from" type="text" data-format="{$USER_MODEL->get('hour_format')}"
										class="clockPicker form-control" value="{\App\Fields\Time::formatToDisplay($RECORD_MODEL->get('working_hours_to'))}"
										title="{\App\Language::translate('LBL_WORKING_HOURS_TO', $QUALIFIED_MODULE)}"
										name="working_hours_to"
										data-validation-engine="validate[required,funcCall[Vtiger_Base_Validator_Js.invokeValidation]]"
										autocomplete="off"/>
								<div class="input-group-append">
									<span class="input-group-text u-cursor-pointer js-clock__btn" data-js="click">
										<span class="far fa-clock"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-1 form-group">
							<label>{\App\Language::translate('LBL_HOLIDAYS', $QUALIFIED_MODULE)}</label>
							<input type="checkbox" name="holidays" value="1" class="form-control"{if isset($RECORD_MODEL) && $RECORD_MODEL->get('holidays')==1} checked="checked"{/if}>
						</div>
						<div class="col-sm-12 col-md-6 col-lg-1 form-group">
							<label>{\App\Language::translate('LBL_DEFAULT', $QUALIFIED_MODULE)}</label>
							<input type="checkbox" name="default" value="1" class="form-control"{if isset($RECORD_MODEL) && $RECORD_MODEL->get('default')==1} checked="checked"{/if}>
						</div>
					</div>
				</div>
			</div>
<!-- /tpl-Settings-BusinessHours-EditViewBlocks -->
{/strip}
