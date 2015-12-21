angular.module('epaOei').service('mapLayers', function() {
  var layers = {
    r_pctlowwa : {
      $service : 'epaSldMapRpctLowWaLayer'
    },
    d3bpo3 : {
      $service : 'epaSldMapD3Bpo3Layer'
    },
    all_b_all : {
      $service : 'nciCountyCancerRateLayer'
    },
    bla_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'bla_b_all',
      state : '29010'
    },
    brs_f_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'brs_f_all',
      state : '26000',
    },
    c19_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'c19_b_all',
      state : '21100',
    },
    col_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'col_b_all',
      state : '21041-21052',
    },
    krp_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'krp_b_all',
      state : '29020',
    },
    leu_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'leu_b_all',
      state : '35011-35043'
    },
    lng_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'lng_b_all',
      state : '22030',
    },
    mel_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'mel_b_all',
      state : '25010',
    },
    nhl_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'nhl_b_all',
      state : '33041-33042',
    },
    pro_m_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'pro_m_all',
      state : '28010',
    },
    thy_b_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'thy_b_all',
      state : '32010',
    },
    ute_f_all : {
      $service : 'nciCountyCancerRateLayer',
      site : 'ute_f_all',
      state : '27030',
    },
    nata : {
      $service : 'epaNataLayer'
    },
    trinet : {
      $service : 'epaTrinetLayer',
    },
    hsa : {
      $service : 'hsaAccessToCareLayer'
    }
  };
  
  function getLayers() {
    return layers;
  }
  
  return {
    getLayers : getLayers
  }
});