/*
 * Create and export configuration variables
 *
 */

// Container for all environments
var environments = {};

// Staging (default) environment
environments.dev = {
  'httpsPort' : 3000,
  'envName' : 'dev',
  'hashingSecret' : 'Secr3tsQui44leZtuff',
  'stripe' : {
    'token_pk' : 'pk_test_t5i7U6Yol1YgUSHycELTn5kz',
    'token_sk' : 'sk_test_ihc87LKn8pooeuvkPDybbKQU',
    'source' : 'tok_visa',
    'currency' : 'usd'
  },
  'mailgun' : {
    'apikey' : 'api:357852c75143002ec383f1a4a22a6213-7bbbcb78-3cd4ad5c'
  }
};

// Production environment
environments.production = {
  'httpsPort' : 5000,
  'envName' : 'production',
  'hashingSecret' : 'Secr3tsQui44leZtuff'
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;

// Export the module
module.exports = environmentToExport;