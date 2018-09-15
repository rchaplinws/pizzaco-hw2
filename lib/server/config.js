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
    'token_pk' : '',
    'token_sk' : '',
    'source' : 'tok_visa',
    'currency' : 'usd'
  },
  'mailgun' : {
    'apikey' : ''
  }
};

// Production environment
environments.production = {
  'httpsPort' : 5000,
  'envName' : 'production',
  'hashingSecret' : 'Secr3tsQui44leZtuff',
  'stripe' : {
    'token_pk' : '',
    'token_sk' : '',
    'source' : 'tok_visa',
    'currency' : 'usd'
  },
  'mailgun' : {
    'apikey' : ''
  }
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;

// Export the module
module.exports = environmentToExport;