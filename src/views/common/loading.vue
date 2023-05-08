<template>
  <div id="loading" class="loading load4">
    <div class="loader" />
    <!-- <div class="rect1" />
    <div class="rect2" />
    <div class="rect3" />
    <div class="rect4" />
    <div class="rect5" /> -->
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data() {
    return {}
  },
  activated() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
    .loading {
        // width: 50px;
        // height: 60px;
        // text-align: center;
        // font-size: 10px;
        z-index: 100;
        /*position: absolute;
        top: 50vh;
        left: calc(50% - 25px);*/
        position: fixed;
        top: 45%;
        left: 50%
    }
     .loader {
        color: #0f58ff;
        // font-size: 20px;
        margin: 100px auto;
        width: 0.8em;
        height: 0.8em;
        border-radius: 50%;
        position: relative;
        text-indent: -9999em;
        -webkit-animation: load4 1.3s infinite linear;
        animation: load4 1.3s infinite linear;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        }
@-webkit-keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -2em 0 0.15em, 1.5em -1.5em 0 0em, 2em 0 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 -1em, -2em 0 0 -1em, -1.5em -1.5em 0 0;
  }
  12.5% {
    box-shadow: 0 -2em 0 0, 1.5em -1.5em 0 0.15em, 2em 0 0 0, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 -1em, -2em 0 0 -1em, -1.5em -1.5em 0 -1em;
  }
  25% {
    box-shadow: 0 -2em 0 -0.5em, 1.5em -1.5em 0 0, 2em 0 0 0.15em, 1.5em 1.5em 0 0, 0 2em 0 -1em, -1.5em 1.5em 0 -1em, -2em 0 0 -1em, -1.5em -1.5em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0em 0 0, 1.5em 1.5em 0 0.15em, 0 2em 0 0em, -1.5em 1.5em 0 -1em, -2em 0em 0 -1em, -1.5em -1.5em 0 -1em;
  }
  50% {
    box-shadow: 0 -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0 0 -1em, 1.5em 1.5em 0 0em, 0 2em 0 0.15em, -1.5em 1.5em 0 0, -2em 0em 0 -1em, -1.5em -1.5em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 0, -1.5em 1.5em 0 0.15em, -2em 0 0 0, -1.5em -1.5em 0 -1em;
  }
  75% {
    box-shadow: 0em -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0em 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 0, -2em 0em 0 0.15em, -1.5em -1.5em 0 0;
  }
  87.5% {
    box-shadow: 0em -2em 0 0, 1.5em -1.5em 0 -1em, 2em 0 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 0, -2em 0em 0 0, -1.5em -1.5em 0 0.15em;
  }
}
@keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -2em 0 0.15em, 1.5em -1.5em 0 0em, 2em 0 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 -1em, -2em 0 0 -1em, -1.5em -1.5em 0 0;
  }
  12.5% {
    box-shadow: 0 -2em 0 0, 1.5em -1.5em 0 0.15em, 2em 0 0 0, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 -1em, -2em 0 0 -1em, -1.5em -1.5em 0 -1em;
  }
  25% {
    box-shadow: 0 -2em 0 -0.5em, 1.5em -1.5em 0 0, 2em 0 0 0.15em, 1.5em 1.5em 0 0, 0 2em 0 -1em, -1.5em 1.5em 0 -1em, -2em 0 0 -1em, -1.5em -1.5em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0em 0 0, 1.5em 1.5em 0 0.15em, 0 2em 0 0em, -1.5em 1.5em 0 -1em, -2em 0em 0 -1em, -1.5em -1.5em 0 -1em;
  }
  50% {
    box-shadow: 0 -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0 0 -1em, 1.5em 1.5em 0 0em, 0 2em 0 0.15em, -1.5em 1.5em 0 0, -2em 0em 0 -1em, -1.5em -1.5em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 0, -1.5em 1.5em 0 0.15em, -2em 0 0 0, -1.5em -1.5em 0 -1em;
  }
  75% {
    box-shadow: 0em -2em 0 -1em, 1.5em -1.5em 0 -1em, 2em 0em 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 0, -2em 0em 0 0.15em, -1.5em -1.5em 0 0;
  }
  87.5% {
    box-shadow: 0em -2em 0 0, 1.5em -1.5em 0 -1em, 2em 0 0 -1em, 1.5em 1.5em 0 -1em, 0 2em 0 -1em, -1.5em 1.5em 0 0, -2em 0em 0 0, -1.5em -1.5em 0 0.15em;
  }
}

    // .loading > div {
    //     background-color: #0f58ff;
    //     height: 100%;
    //     width: 6px;
    //     display: inline-block;

    //     -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
    //     animation: stretchdelay 1.2s infinite ease-in-out;
    // }

    // .loading .rect2 {
    //     -webkit-animation-delay: -1.1s;
    //     animation-delay: -1.1s;
    // }

    // .loading .rect3 {
    //     -webkit-animation-delay: -1.0s;
    //     animation-delay: -1.0s;
    // }

    // .loading .rect4 {
    //     -webkit-animation-delay: -0.9s;
    //     animation-delay: -0.9s;
    // }

    // .loading .rect5 {
    //     -webkit-animation-delay: -0.8s;
    //     animation-delay: -0.8s;
    // }
    // @-webkit-keyframes stretchdelay {
    //     0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
    //     20% { -webkit-transform: scaleY(1.0) }
    // }

    // @keyframes stretchdelay {
    //     0%, 40%, 100% {
    //         transform: scaleY(0.4);
    //         -webkit-transform: scaleY(0.4);
    //     }  20% {
    //            transform: scaleY(1.0);
    //            -webkit-transform: scaleY(1.0);
    //        }
    // }
</style>
