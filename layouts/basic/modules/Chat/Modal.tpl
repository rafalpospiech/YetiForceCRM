{*<!-- {[The file is published on the basis of YetiForce Public License 3.0 that can be found in the following directory: licenses/LicenseEN.txt or yetiforce.com]} -->*}
{strip}
	<!-- tpl-Chat-Modal -->
	{function ROOM_ITEM CLASS_NAME=''}
		{assign var=SELECTED value=$CURRENT_ROOM['recordId']==$ROOM['recordid'] && $CURRENT_ROOM['roomType']==$ROOM_TYPE }
		<li class="text-truncate js-room {if $SELECTED} active{/if} {$CLASS_NAME}"
			title="{\App\Purifier::encodeHtml($ROOM['name'], 'Chat')}"
			data-record-id="{$ROOM['recordid']}"
			data-js="click">
			<span class="js-room-name" data-js="append|replace">{$ROOM['name']}</span>
			<span class="js-room-cnt badge badge-info ml-1 inline"
				  data-js="append|replace">{$ROOM['cnt_new_message']}</span>
		</li>
	{/function}
	<div class="modal-body pt-0 pb-0">
		<div class="row p-0">
			<div class="col-2 bg-color-grey-50 m-0 p-0 js-room-list" data-js="container">
				<div class="row w-100 text-right pl-5 pr-1 pt-2 pb-2">
					<span class="fas fa-history ml-auto mr-1 js-btn-history" data-js="click"></span>
					<span class="fas fa-cog mr-1 js-btn-settings" data-js="click"></span>
					{*<span class="fas fa-bell mr-1 js-btn-bell" data-js="click" data-icon-on="fa-bell"
						  data-icon-off="fa-bell-slash"></span>*}
					<button type="button" class="btn js-btn-bell fas fa-bell">
						<span class="fas fa-bell mr-1 js-btn-bell" data-js="click" data-icon-on="fa-bell"
							  data-icon-off="fa-bell-slash"></span>
					</button>
				</div>
				{ROOM_ITEM ROOM=['recordid'=>'', 'name'=>'', 'cnt_new_message'=>''] CLASS_NAME='hide js-temp-item-room'}
				{foreach item=GROUP_ROOM key=KEY from=\App\Chat::getRoomsByUser()}
					{assign var=LBL_GROUP_ROOM value="LBL_ROOM_$KEY"|upper}
					<div class="text-uppercase bg-color-grey-200 p-2">
						{\App\Language::translate($LBL_GROUP_ROOM, $MODULE_NAME)}
					</div>
					<ul class="js-room-type" data-room-type="{$KEY}" data-js="data">
						{foreach item=ROOM from=$GROUP_ROOM}
							{ROOM_ITEM ROOM=$ROOM CLASS_NAME='' ROOM_TYPE=$KEY }
						{/foreach}
					</ul>
				{/foreach}
			</div>
			<div class="col-10 m-0">
				{include file=\App\Layout::getTemplatePath('Chat.tpl', 'Chat')}
			</div>
		</div>
	</div>
	<!-- /tpl-Chat-Modal -->
{/strip}
