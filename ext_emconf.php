<?php
/***************************************************************
 * config file for ext "Camelia".
 *
 *
 ***************************************************************/
$EM_CONF[$_EXTKEY] = array(
	'title' => 'Theme Camelia',
	'description' => 'Camelia multipurpose theme (The Develovers. All Rights Reserved) adatpé pour Typo3',
	'category' => 'fe',
	'author' => 'Loic de Terwangne',
	'author_email' => 'loic.deterwangne@gmail.com',
	'shy' => '',
	'dependencies' => '',
	'conflicts' => '',
	'priority' => '',
	'module' => '',
	'state' => 'alpha',
	'internal' => '',
	'uploadfolder' => 1,
	'modify_tables' => '',
	'clearCacheOnLoad' => 1,
	'lockType' => '',
	'author_company' => '',
	'version' => '0.0.1',
	'constraints' => array(
		'depends' => array(
			'typo3' => '6.2.12-7.99.99',
			'bootstrap_package' => '6.2.12-7.99.99',
			'bootstrap_package_gabarits' => '6.2.12-7.99.99',
		),
		'conflicts' => array(),
		'suggests' => array(
			'news' => '3.2.0-0.0.0',
			'calendarize_news' => '0.2.0-0.0.0',
        ),
	),
	'_md5_values_when_last_written' => '',
	'suggests' => array(),
);
?>
