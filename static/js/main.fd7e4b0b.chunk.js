(this["webpackJsonpkill-dev-words"]=this["webpackJsonpkill-dev-words"]||[]).push([[0],{27:function(t,e,n){},28:function(t,e,n){},63:function(t,e,n){"use strict";n.r(e);var i=n(0),o=n.n(i),a=n(15),r=n.n(a),s=(n(27),n(4)),c=(n(28),n(19));var l,d=function(t){var e=t.word,n=void 0===e?"":e,i=t.timestamp,o=t.pos,a=t.duration,r=t.isTyped,s=void 0===r?0:r,c=Math.floor(1e4*Math.random()),l=n,d=function(t){return l=t},u=function(){return s++};return{timestamp:i,pos:o,id:c,getWord:function(){return l},getTyped:function(){return s},setTyped:u,duration:a,setWord:d,isKilled:function(){return l.length===s}}};function u(t){return t.find((function(t){return t.getTyped()}))}function m(t,e){var n=t.timestamp+t.duration,i=e.timestamp+e.duration;return n<i?-1:n===i?0:1}function f(t){return t.isKilled()}!function(t){t[t.PLAY=0]="PLAY",t[t.SCORE=1]="SCORE"}(l||(l={}));var p,v=function(t){var e=t.duration,n=void 0===e?3e4:e,i=t.WORDS,o=void 0===i?[]:i,a=t.PLAYER_OFFSET,r=Date.now(),s=0,p=l.PLAY,v=0,h=0,g=function(t){var e=t.getWord().length;h+=123*e,v+=100},b=[],j=[],x=0,y=function(t){return Math.floor(3800+t.length*(1200+600*Math.random()))*(v>=200?1/(v/200):1)},O=function(){var t=Date.now();if(x<=t){x=function(){var t=Date.now(),e=Math.floor(2e3+2e3*Math.random());return t+e}();var e=function(){var t=Math.floor(Math.random()*(null===o||void 0===o?void 0:o.length));return o[t]}();j.push(d({word:e,pos:Math.floor(100*Math.random()),timestamp:Date.now(),duration:y(e)}))}},w=function(){var t=Date.now();return r+n<=t},k=function(){return Date.now()-r},E=function(t){var e=document.getElementById("particles")||{},n=(e.clientWidth,e.clientHeight),i=void 0===n?0:n,o=Date.now(),r=t.pos,s=t.duration,l=1-(s-(s-(o-t.timestamp+180)))/s,d=r/100,u=0,m={x:d+(.5-d)*(1-l),y:u+((i-a)/i-u)*(1-l)},f={timestamp:Date.now(),key:String(1e4*Math.random()),destination:m,duration:180};b=[].concat(Object(c.a)(b),[f])},M=function(){return b};return{onKeydown:function(t){var e=t.code.toLowerCase().replace("key",""),n=u(j);if(!n){var i=function(t,e){return t.sort(m).find((function(t){return 0===(0,t.getWord)().indexOf(e)}))||null}(j,e);return null===i||void 0===i||i.setTyped(),i&&E(i),i}return n.getWord()[null===n||void 0===n?void 0:n.getTyped()]===e?(n.setTyped(),E(n),n):null},getState:function(){return{state:p,score:h,game_duration:s,words:j,getParticles:M,start_timestamp:r,current:u(j)}},tick:function(){var t,e=function(t){var e=t.find(f);return{score:Boolean(e),killed:e}}(j),i=e.score,o=e.killed;i&&o&&g(o),function(t){var e=function(t){var e=t.duration;return t.timestamp+e<=Date.now()};return Boolean(t.find(e))}(j)||w()?(t=w(),p=l.SCORE,s=t?n:k()):(j=function(t){return t.filter((function(t){return!f(t)}))}(j),O()),function(){var t=!1,e=Date.now(),n=b.filter((function(n){return!(n.timestamp+n.duration<e)||(t=!0,!1)}));t&&(b=n)}()}}},h=n(14),g=n(16),b=n(21),j=n(17),x=n(20),y=n(22),O=n.p+"static/media/desktop-mini.6f7d810a.png",w=n(1);var k=o.a.memo((function(t){var e=t.value,n=void 0===e?0:e;return Object(w.jsx)(j.a,{decimals:0,speed:1e3,ease:"cubicIn",value:n,customFunctionRender:function(t){return Math.floor(t).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}},"score")}));function E(t){var e=t.destination,n=t.duration,i=t.key,o=document.getElementById("particles")||{offsetHeight:1,offsetWidth:1},a=o.offsetHeight,r=o.offsetWidth,s=M(e.x,0,1,-r/2,r/2),c=M(e.y,0,1,-a,0),l=Object(x.a)(p||(p=Object(g.a)(["\n  from, {\n    transform: translate3d(0, 0, 0);\n  }\n\n  to {\n    transform: translate3d(","px, ","px,0);\n  }\n"])),s,c);return Object(w.jsx)("div",{className:Object(y.a)({animation:"".concat(l," ").concat(n,"ms ease infinite"),position:"absolute",bottom:"calc(45px - (9px / 2))",left:"calc(50% - (9px / 2))",transform:"translate(0, 0)",width:"9px",height:"9px",background:"white",animationTimingFunction:"steps(".concat(Math.floor(n/30),", end)")})},i)}function M(t,e,n,i,o){return i+(o-i)*(t-e)/(n-e)}function S(t){return String(t).padStart(2,"0")}function N(t){var e=t.state,n=t.duration;return Object(w.jsx)("div",{className:"gameover eightBit",children:e.game_duration===n?"TIME IS UP":"GAME OVER"})}var I=function(t){var e=t.state,n=t.tickId,a=t.duration,r=t.FPS,c=o.a.useMemo((function(){return null===e||void 0===e?void 0:e.words.map((function(t){var e=t.duration,n=t.getWord(),i=n.substr(0,t.getTyped()),o=i?n.substr(t.getTyped(),1):null,a=n.substr(i?t.getTyped()+1:t.getTyped()),r=Math.floor(e/110);return Object(w.jsxs)("div",{className:"word toEnd eightBit",style:{zIndex:o?2:1,left:t.pos+"%",transitionDuration:"".concat(e,"ms"),animationDuration:"".concat(e,"ms"),animationTimingFunction:"steps(".concat(r,", end)"),transitionTimingFunction:"steps(".concat(r,", end)")},children:[Object(w.jsx)("span",{className:"outlined_inverted",children:i}),o?Object(w.jsx)("span",{className:"cursor",children:o}):null,Object(w.jsx)("span",{children:a})]},t.id)}))}),[(null===e||void 0===e?void 0:e.words)||[]]),d=(null===e||void 0===e?void 0:e.getParticles())||[],u=o.a.useMemo((function(){return d.map((function(t){return Object(w.jsx)(E,Object(b.a)({},t))}))}),[d||[]]),m=(e||{}).start_timestamp,f=function(t){var e=t.start_timestamp,n=t.duration,i=t.tickId-e,o=function(t){var e,n,i;return i=Math.floor(t/1e3),n=Math.floor(i/60),i%=60,e=Math.floor(n/60),n%=60,{day:Math.floor(e/24),hour:e%=24,minute:n,seconds:i}}(Math.max(n-i,0)),a="".concat(S(o.minute),":").concat(S(o.seconds)),r=Math.min(i,n)/n;return[a,r]}({start_timestamp:void 0===m?0:m,duration:a,tickId:n}),p=Object(s.a)(f,2),v=p[0],h=p[1];return Object(i.useEffect)((function(){var t=window.devicePixelRatio||1,e=document.getElementById("desktop");e.width=e.clientWidth*t,e.height=e.clientHeight*t;var n=e.getContext("2d"),i=new Image;i.src=O,i.onload=function(){if(n){n.scale(t,t);var o=1.15*i.width,a=1.15*i.height;n.drawImage(i,Math.floor((e.width-o)/2),100+Math.floor((e.height-a)/2),o,a)}}}),[]),Object(w.jsxs)("div",{className:"game",children:[Object(w.jsx)("div",{className:"deadline",children:Object(w.jsxs)("div",{className:"deadline-container",style:{position:"absolute",top:"36px",left:"36px",willChange:"transform",transition:"transform ".concat(Math.floor(1e3/r),"ms"),transform:"translate3d(0,".concat(Math.floor(M(h,0,1,0,978)),"px,0)")},children:[Object(w.jsx)("span",{className:"outlined",children:"DEADLINE"}),Object(w.jsxs)("span",{style:{marginLeft:"0.2em"},children:["\xa0",v]})]})}),Object(w.jsxs)("div",{className:"container",children:[Object(w.jsx)("div",{className:"logo"}),Object(w.jsxs)("div",{className:"viewport",children:[(null===e||void 0===e?void 0:e.state)===l.SCORE?Object(w.jsx)(N,{duration:a,state:e}):null,(null===e||void 0===e?void 0:e.state)===l.PLAY?Object(w.jsxs)(w.Fragment,{children:[Object(w.jsx)("div",{className:"words",children:c}),Object(w.jsx)("div",{className:"particles",id:"particles",children:u})]}):null,Object(w.jsx)("canvas",{style:{width:"100%",height:"100%"},id:"fireworks"}),Object(w.jsx)("div",{className:"player"})]}),Object(w.jsx)("canvas",{id:"desktop",className:"desktop"})]}),Object(w.jsxs)("div",{className:"sidebar",children:[Object(w.jsxs)("div",{className:"score",children:[Object(w.jsx)("span",{className:"outlined",children:"SCORE"}),Object(w.jsxs)("span",{style:{marginLeft:"0.2em",minWidth:"4em",display:"inline-block"},children:["\xa0",Object(w.jsx)(k,{value:null===e||void 0===e?void 0:e.score},"score-wrapper")]})]}),Object(w.jsx)("div",{style:{opacity:0},className:"typed-char outlined",children:"T"})]})]})},D=function(){var t={1:"nil lib go pen var if add zsh run php bug fix api key add all id em erb rem px ux ui svg for box git xml rtc pre rgb hsl rel web js def moz end to dev css".split(" "),2:"void null code scss bash else push edge ruby pull tidy head body foot haml slim jade true html color top span left right save fork flex none bold auto href link size ease fill path rgba hsla from skew sort font size team sass hash json less attr text data".split(" "),3:"react ember event width height clone gulp concat fetch valid aside style elsif babel jquery param start assign posts logos chrome blogs block align xcode slack class agile xmlns origin comma scrum stroke scale false rails".split(" "),4:"inline method deploy target assign window grunt commit minify jekyll stylus article import tweets google opacity weight bottom scroll italic profile hidden github keytrap editor webkit string number integer decimal period jsconf".split(" "),5:"inherit function includes bourbon normalize angular explorer section ternary twitter overflow absolute postcss invalid viewbox content sublime session display background compile bracket backbone boolean codepen dreamhire contains standup".split(" "),6:"chriscoyier javascript cssdevconf customers autoprefixer stackoverflow visibility headphones underscore bootstrap csstricks typescript livescript customer settings semicolon attribute parenthesis markdown compiler responsive preprocessor webdesign developer development".split(" "),authors:"gary petr anna sergey manychat".split(" ")};return Object.values(t).flat()}();var T=function(){var t=Object(i.useState)(null),e=Object(s.a)(t,2),n=e[0],a=e[1],r=Object(i.useState)(0),c=Object(s.a)(r,2),d=c[0],u=c[1],m=Object(i.useState)(null),f=Object(s.a)(m,2),p=f[0],g=f[1],b=o.a.useMemo((function(){return v({WORDS:D,PLAYER_OFFSET:65,duration:3e4})}),[]),j=o.a.useCallback((function(t){var e=t.key,n=t.code,i=b.onKeydown({key:e,code:n});i?i.isKilled()&&function(t){var e=document.getElementById("fireworks"),n=e?h.a.create(e,{resize:!0}):h.a,i=Date.now(),o=t.pos,a=t.duration,r=1-(a-(a-(i-t.timestamp)))/a;if(e){var s={x:o/100,y:0},c={x:.5,y:(e.clientHeight-65)/e.clientHeight},l={x:s.x+(c.x-s.x)*(1-r),y:s.y+(c.y-s.y)*(1-r)};n({particleCount:5+10*Math.random(),spread:220,startVelocity:10,ticks:35,gravity:.5,colors:["#ffffff"],shapes:["square"],origin:{x:l.x,y:l.y}})}else n({particleCount:10,spread:220,startVelocity:10,ticks:40,gravity:.4,colors:["#ffffff"],shapes:["square"],origin:{x:Math.random(),y:Math.random()-.2}})}(i):console.log("miss")}),[]);return Object(i.useEffect)((function(){document.addEventListener("keydown",j);var t=function(){b.tick(),g(b.getState()),u(Date.now())};t();var e=setInterval(t,1e3/30);return a(e),function(){clearInterval(e),document.removeEventListener("keydown",j)}}),[]),Object(i.useEffect)((function(){(null===p||void 0===p?void 0:p.state)===l.SCORE?(console.log("SCORE SCREEN"),n&&clearInterval(n),a(null)):(null===p||void 0===p?void 0:p.state)===l.PLAY&&console.log("PLAY SCREEN")}),[null===p||void 0===p?void 0:p.state]),Object(i.useEffect)((function(){var t=document.getElementById("desktop"),e=t.getContext("2d"),n=new Image;n.src=O,n.onload=function(){e&&e.drawImage(n,t.clientWidth,t.clientHeight)}}),[]),Object(w.jsx)("div",{className:"App",children:Object(w.jsx)(I,{FPS:30,duration:3e4,tickId:d,state:p})})};r.a.render(Object(w.jsx)(o.a.StrictMode,{children:Object(w.jsx)(T,{})}),document.getElementById("root"))}},[[63,1,2]]]);
//# sourceMappingURL=main.fd7e4b0b.chunk.js.map