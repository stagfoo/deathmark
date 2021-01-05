import joro from 'joro';

export const DS = {
  fontFamily: {
    default: "Fira Mono, san-serif",
    alt: "'Fira Mono', san-serif",
  },
  fontSizes: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,

  },
  gutters: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  colors: {
    purple: "#8D58FD",
    blue: "#58D5FD",
    green: "#3adcad",
    black: "#0d1017",
    red: "#ff4763"
  }
}

export const STYLES = new joro();


function buttonStyle(){
  return `
  width: 150px;
  background: ${DS.colors.black};
  color:  ${DS.colors.red};
  text-transform: uppercase;
  text-style: bold;
  box-sizing: border-box;
  text-shadow: 0px 1px ${DS.colors.red};
  font-size: ${DS.fontSizes.md}px;
  padding: ${DS.gutters.md}px;
  border: 1px solid ${DS.colors.red};
  text-decoration: none;
  `
}
export function notificationStyle(){
  STYLES.add("notificationStyle", `
  .notification {
    background: #fff;
    box-shadow: 10px 10px 0px #000;
    position:fixed;
    font-size: ${DS.fontSizes.md}px;
    padding: ${DS.gutters.md}px;
    width: 320px;
    text-align:center;
    transition: ease all 0.3s;
    animation-name: notification;
    animation-duration: 0.3s;
    bottom: 5vh;
    }
  .notification.hide {
    animation-name: notification-out;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  }
  `)
}

export function BaseStyles() {
  STYLES.add("baseStyles", `
    html,body {
      margin: 0;
      padding: 0;
      background: url('https://images6.alphacoders.com/107/thumb-1920-1072679.jpg');
      color:  ${DS.colors.red};
      opacity: 1;
    }
    #app {
      background-color: rgba(0,0,0,0.8);
    }
    textarea,
    button {
      display: inline-block;
      margin: ${DS.gutters.sm}px;
      ${buttonStyle()}
    }
    button b {
      text-shadow: 0px 1px ${DS.colors.green};
    }
    button small {
      color:  ${DS.colors.green};
      text-shadow: 0px 1px ${DS.colors.green};
    }
    .button-bar {
      width: 1080px;
      margin: 0 auto;
    }
    video {
      display:block;
      margin: 0 auto;
    }
    canvas {
      position: absolute;
      top: -100vh;
    }
    @keyframes notification {
      from {bottom: -120vh;}
      to { bottom: 5vh; }
    }
    @keyframes notification-out {
      to {bottom: -5vh; display:none;}
      from {bottom: 5vh; display:block;}
    }
  `)
}