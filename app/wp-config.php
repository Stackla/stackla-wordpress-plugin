<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'stackla_wordpress');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'K*DlT+h4w6*[ZzGlN5-iF~m)B90i@be6A+=0p4*QS&-u@hes#9P?gjV/xR V1$A(');
define('SECURE_AUTH_KEY',  '<iSxi9&$f6l]2V<#SfUp2C!D/ULG;N(h[Z&;_oH7rthEDs*y?StT)toU-.}SO,Ez');
define('LOGGED_IN_KEY',    '_P>RjM*JiEwn=(u+NMla3^-[2o`MZp7>j2`c^N[*T&fSqKt3AGTOGX-}]9&E|7V0');
define('NONCE_KEY',        '9 lmR](})sC*&Z5amX- .x+D*ShR?*Sl BRewdwf4V|V.FarO6oLuFQuP(ffsHyK');
define('AUTH_SALT',        ';J:SRpm*+Xr|k|,#8%1g bF=v7gl^iSQOCz!-tgS~SLTIaK;q%Z]up:0|3C4@tU0');
define('SECURE_AUTH_SALT', '}_xBry)W[5j-V,aIru]&p<|4s/8qeXf?&L[@&3?eCXYggHEuSDJJO{IYxNT35.g{');
define('LOGGED_IN_SALT',   'U-;U(W#g7RpBkbqD#^4|.Q+8QM[ObLE[htc@&@~7Z!H+KJ1/T774Bu>?[>O/^2ko');
define('NONCE_SALT',       ':hG$h@164~`u4d<n9$,$#s+u|Bupx}2_sYC4AeB}Krxhw4F}I+ul@~C[SzFv+*;%');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
