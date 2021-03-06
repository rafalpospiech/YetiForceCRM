<?php

/**
 * MultiDomain class.
 *
 * @package   App
 *
 * @copyright YetiForce Sp. z o.o.
 * @license YetiForce Public License 3.0 (licenses/LicenseEN.txt or yetiforce.com)
 * @author Rafal Pospiech <r.pospiech@yetiforce.com>
 */

namespace App\Fields;

/**
 * MultiDomain class.
 */
class MultiDomain
{
	/**
	 * Find crm ids with specified domain.
	 *
	 * @param string $moduleName
	 * @param string $fieldName
	 * @param string $domain
	 *
	 * @return int[]
	 */
	public static function findIdByDomain(string $moduleName, string $fieldName, string $domain)
	{
		$crmids = [];
		$queryGenerator = new \App\QueryGenerator($moduleName);
		$queryGenerator->permissions = false;
		if ($queryGenerator->getModuleField($fieldName)) {
			$queryGenerator->setFields(['id']);
			$queryGenerator->addNativeCondition(['like', $fieldName, ",$domain,"]);
			$crmids = $queryGenerator->createQuery()->column();
		}
		return $crmids;
	}
}
