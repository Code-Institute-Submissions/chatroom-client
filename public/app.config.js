angular
    .module('appConfig', ['angular-loading-bar'])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.spinnerTemplate = '<div style="color: ##8d5885;"><span class="fa fa-circle-o-notch fa-spin"></span> <b>We\'re fetching you data</b></div>';
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;
    }])