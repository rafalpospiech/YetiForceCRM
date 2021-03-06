<?php
/* +***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 * Contributor(s): YetiForce Sp. z o.o
 * *********************************************************************************** */

class Services_Relation_Model extends Products_Relation_Model
{
	/**
	 * Get services pricebooks.
	 */
	public function getServicePricebooks()
	{
		$queryGenerator = $this->getQueryGenerator();
		$queryGenerator->setCustomColumn('vtiger_pricebookproductrel.listprice');
		$queryGenerator->addJoin(['INNER JOIN', 'vtiger_pricebookproductrel', 'vtiger_pricebook.pricebookid = vtiger_pricebookproductrel.pricebookid']);
		$queryGenerator->addNativeCondition(['vtiger_pricebookproductrel.productid' => $this->get('parentRecord')->getId()]);
		$queryByProduct = new \App\QueryGenerator('Services');
		if (($fieldModel = $queryByProduct->getModuleField('unit_price')) && $fieldModel->isActiveField()) {
			$queryGenerator->addJoin(['INNER JOIN', $fieldModel->getTableName(), $queryByProduct->getColumnName('id') . ' = vtiger_pricebookproductrel.productid']);
			$queryGenerator->setCustomColumn($queryByProduct->getColumnName($fieldModel->getName()));
			$queryByProduct->setFields(['id']);
			$queryByProduct->permissions = false;
			$queryGenerator->addNativeCondition([$queryByProduct->getColumnName('id') => $queryByProduct->createQuery()]);
		}
	}
}
