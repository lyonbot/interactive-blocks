var j=Object.defineProperty,V=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var P=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,X=Object.prototype.propertyIsEnumerable;var H=(i,t,e)=>t in i?j(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,x=(i,t)=>{for(var e in t||(t={}))J.call(t,e)&&H(i,e,t[e]);if(P)for(var e of P(t))X.call(t,e)&&H(i,e,t[e]);return i},_=(i,t)=>V(i,z(t));import{r,c as Y}from"./vendor.94ee8ec3.js";const G=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const u of n)if(u.type==="childList")for(const s of u.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function e(n){const u={};return n.integrity&&(u.integrity=n.integrity),n.referrerpolicy&&(u.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?u.credentials="include":n.crossorigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function o(n){if(n.ep)return;n.ep=!0;const u=e(n);fetch(n.href,u)}};G();function D(){return D=Object.assign||function(i){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(i[o]=e[o])}return i},D.apply(this,arguments)}const N=(i,t,e)=>{const o=i._listeners;o[t]?o[t].push(e):o[t]=[e]};class U{constructor(){this._listeners={}}on(t,e){return N(this,t,{listener:e}),this}once(t,e){return N(this,t,{listener:e,once:!0}),this}off(t,e){const o=this._listeners[t];if(!o)return this;if(o.length===1&&e===o[0].listener)return this._listeners[t]=null,this;const n=o.findIndex(u=>u.listener===e);return n!==-1&&o.splice(n,1),this}emit(t,...e){const o=this._listeners[t];if(!o)return;let n=!1;o.forEach(u=>{u.listener(e),u.once&&(n=!0)}),n&&(this._listeners[t]=o.filter(u=>!u.once))}removeAllListeners(){return this._listeners={},this}}function q(i,t){return!(typeof i!="object"||!i||i.isIBClipboardData!==!0||typeof t=="string"&&t!==i.ibContextBrand||typeof i.ibContextBrand!="string"||"ibContextUUID"in i&&typeof i.ibContextUUID!="string"||!Array.isArray(i.blocksData)||i.blocksData.some(e=>typeof e!="object"||e===null))}const g=()=>function(i){Object.assign(this,i),this.returnValue=!0,this.preventDefault=()=>{this.returnValue=!1}},Q=g(),Z=g(),tt=g(),et=g(),ot=g(),ut=g(),O=(i,t)=>typeof i=="function"?i(t):i;class nt{get activeNumber(){return this._activeNumber}get isActive(){return this._activeNumber!==!1}get hasFocus(){return this.isActive&&this.ctx.hasFocus}get ref(){return this.info.ref}_maybeUpdateActiveNumber(t){var e,o;return this._activeNumber!==t&&(this._activeNumber=t,(e=(o=this.info).onStatusChange)==null||e.call(o,this),!0)}select(t){this.ctx.addBlockToSelection(this,t)}unselect(){this.isActive&&(this.ctx.activeBlocks.delete(this),this.ctx.syncActiveElementStatus())}focus(t){this.isActive||this.select(t),this.ctx.focus()}constructor(t,e,o){this.type="block",this.ctx=void 0,this.ownerSlot=void 0,this.slots=new Set,this.info=void 0,this._activeNumber=!1,this.handlePointerUp=()=>this.ctx.handleBlockPointerUp(this,!1),this.handlePointerUpCapture=()=>this.ctx.handleBlockPointerUp(this,!0),this.ctx=t,this.ownerSlot=e,e&&e.items.add(this),this.info=o}get index(){return O(this.info.index,this)}get data(){return O(this.info.data,this)}createSlot(t){return this.ctx.createSlot(t,this)}dispose(){var t;this.ctx.activeBlocks.has(this)&&(this.ctx.activeBlocks.delete(this),this.ctx.syncActiveElementStatus()),(t=this.ownerSlot)==null||t.items.delete(this),this.slots.forEach(e=>e.dispose()),this.slots.clear(),this.info=st}}const st={index:()=>{throw new Error("Accessing a disposed block")},data:()=>{throw new Error("Accessing a disposed block")}};function it(i,t){let e,o;function n(s=!1){e&&(s&&o&&i(...o),clearTimeout(e),e=null,o=void 0)}const u=function(...s){o=s,e||(e=setTimeout(()=>n(!0),t))};return u.cancel=()=>n(!1),u.flush=()=>n(!0),u}function b(i,t){const e=t.map(o=>i[o]).filter(o=>o!==void 0);return[...t].sort((o,n)=>n-o).forEach(o=>i.splice(o,1)),e}function rt(i,t,e){const o=b(i,t);i.splice(e,0,...o)}function lt(i,t,e,o){const n=b(i,t);e.splice(o,0,...n)}function M(i,t){if(t==="camelCase")return i;const e={};return Object.keys(i).forEach(o=>{var n;let u=o;t==="react"&&(u=`on${(n=u[0])==null?void 0:n.toUpperCase()}${u.substr(1)}`),t==="lowercase"&&(u=u.toLowerCase()),e[u]=i[o]}),e}function R(i,t){if(!i)return;let e=0;for(const o of i){if(t(o,e))return o;e+=1}}function k(i){if(i)return i[Symbol.iterator]().next().value}const ct="webkitRequestAnimationFrame"in window,f=document.createElement("div");f.style.cssText="position:fixed;pointer-events:none;left:0;top:0;background: #FFF; border: 1px solid #000; padding: 4px 8px;transform:translate(-50%, -50%)";class at extends U{constructor(t){super(),this.ctx=void 0,this.draggingBlocks=void 0,this.slotOfDraggingBlocks=void 0,this.isHovering=!1,this.hoveringSlot=void 0,this.hoveringBlock=void 0,this.dropEffect=void 0,this.setHoveringSlot=it(this._originalSetHoveringSlot.bind(this),50),this.ctx=t}dispose(){this.removeAllListeners(),this.setHoveringSlot.cancel()}_originalSetHoveringSlot(t,e){var o;if(t&&typeof e!="number")throw new Error("Cannot setHoveringSlot with indexToDrop unknown");if(t===this.hoveringSlot)return void(t&&t.indexToDrop!==e&&(t.indexToDrop=e,t.info.onDragHoverStatusChange==null||t.info.onDragHoverStatusChange(this.ctx),this.emit("hoverChanged",this.ctx)));const n=this.hoveringSlot;((o=this.hoveringBlock)==null?void 0:o.ownerSlot)!==t&&(this.hoveringBlock=void 0),this.hoveringSlot=t,this.isHovering=!!t,n&&(n.isDragHovering=!1,n.indexToDrop=void 0,n.info.onDragHoverStatusChange==null||n.info.onDragHoverStatusChange(this.ctx)),t&&(t.isDragHovering=!0,t.indexToDrop=e,t.info.onDragHoverStatusChange==null||t.info.onDragHoverStatusChange(this.ctx)),this.emit("hoverChanged",this.ctx)}getDefaultBlockEventHandlers(t,e){return M({dragStart:this.handleBlockDragStart.bind(this,t),dragEnd:this.handleBlockDragEnd.bind(this,t),dragOver:this.handleBlockDragOver.bind(this,t),dragLeave:this.handleBlockDragLeave.bind(this,t)},e)}handleBlockDragStart(t,e){const o=e.dataTransfer;if(!o)return;this.ctx.activeBlocks.has(t)||this.ctx.addBlockToSelection(t,"none");const n=this.ctx.options.serializeForClipboard(this.ctx.dumpSelectedData());if(!n)return;const u=Array.from(this.ctx.activeBlocks),s=new ot({type:"blockDragStart",text:n,blocks:u,ctx:this.ctx,currentBlock:t,dataTransfer:o,event:e});if(t.info.onDragStart==null||t.info.onDragStart(s),this.emit("blockDragStart",s),s.returnValue===!1)return;e.stopPropagation(),o.setData("text/plain",s.text),o.setData("x-block-context/uuid",this.ctx.uuid),o.setData(`x-block-context/brand-${this.ctx.brand}`,"true"),u.length>1&&(document.body.appendChild(f),f.style.left=`${e.clientX}px`,f.style.top=`${e.clientY}px`,setTimeout(()=>f.remove(),100),f.textContent=`${u.length} items`,o.setDragImage(f,f.offsetWidth/2,f.offsetHeight/2));const l=this.ctx.slotOfActiveBlocks;this.draggingBlocks=u,this.slotOfDraggingBlocks=l||void 0,l&&(this.setHoveringSlot(l,t.index),this.setHoveringSlot.flush())}handleBlockDragEnd(t,e){this.slotOfDraggingBlocks=void 0,this.draggingBlocks=void 0,this.setHoveringSlot(void 0)}handleBlockDragOver(t){this.hoveringBlock!==t&&t.ownerSlot==this.hoveringSlot&&(this.hoveringBlock=t,this.emit("hoverChanged",this.ctx))}handleBlockDragLeave(t){this.hoveringBlock===t&&(this.hoveringBlock=void 0,this.emit("hoverChanged",this.ctx))}getDefaultSlotEventHandlers(t,e){return M({dragOver:o=>{this.handleSlotDragOver(t,o)&&(o.preventDefault(),o.stopPropagation())},dragLeave:o=>{this.handleSlotDragLeave(t),o.preventDefault(),o.stopPropagation()},drop:o=>{this.handleSlotDrop(t,o),o.preventDefault(),o.stopPropagation()}},e)}handleSlotDragOver(t,e){var o;if((o=e.dataTransfer)!=null&&o.types.includes("x-block-context/uuid")&&!e.dataTransfer.types.includes(`x-block-context/brand-${this.ctx.brand}`))return!1;const n=this.computeIndexToDrop(t,e);return n!==!1&&(this.setHoveringSlot(t,n),!0)}handleSlotDrop(t,e){const o=this.computeIndexToDrop(t,e);if(o===!1)return;const n=this.dropEffect,u=this.draggingBlocks,s=this.ctx,l=new ut({type:"slotBeforeDrop",ctx:s,slot:t,dropEffect:n,dataTransfer:e.dataTransfer,event:e,indexToDrop:o,isDraggingFromCurrentCtx:!!u,draggingBlocks:u});if(this.emit("slotBeforeDrop",l),l.returnValue===!1)return this.setHoveringSlot(void 0),void this.setHoveringSlot.flush();if(this.setHoveringSlot(t,o),this.setHoveringSlot.flush(),u&&n!=="copy")if(t===s.slotOfActiveBlocks){const c=o-u.filter(h=>h.index<o).length,a=new tt({type:"moveInSlot",blocks:u,ctx:s,slot:t,index:c});if(t.info.onMoveInSlot==null||t.info.onMoveInSlot(a),s.emit("moveInSlot",a),!a.returnValue)return;setTimeout(()=>{s.activeSlot=t,s.activeBlocks.clear(),t.items.forEach(h=>{const d=h.index;d>=c&&d<c+u.length&&s.activeBlocks.add(h)}),s.syncActiveElementStatus(),s.focus()},100)}else{const c=o,a=new et({type:"moveBetweenSlots",blocks:u,ctx:s,fromSlot:s.slotOfActiveBlocks,toSlot:t,index:c});if(t.info.onMoveToThisSlot==null||t.info.onMoveToThisSlot(a),s.emit("moveBetweenSlots",a),!a.returnValue)return;setTimeout(()=>{s.activeSlot=t,s.activeBlocks.clear(),t.items.forEach(h=>{const d=h.index;d>=c&&d<c+u.length&&s.activeBlocks.add(h)}),s.syncActiveElementStatus(),s.focus()},100)}else try{const c=this.ctx.options.unserializeForClipboard(e.dataTransfer.getData("text/plain"));s.activeSlot=t,s.activeBlocks.clear(),s.syncActiveElementStatus(),s.pasteWithData(c,o),s.focus()}catch(c){console.error("Failed to drop")}this.setHoveringSlot(void 0)}handleSlotDragLeave(t){this.setHoveringSlot(void 0)}computeIndexToDrop(t,e){var o;let n=e.dataTransfer.dropEffect;if(n==="none"&&ct&&(n=e.ctrlKey||e.altKey?"copy":"move"),this.dropEffect=n,this.dropEffect!=="copy"&&(o=this.draggingBlocks)!=null&&o.some(c=>t.isDescendantOfBlock(c)))return!1;const u=t.info.computeIndexToDrop==null?void 0:t.info.computeIndexToDrop({ctx:this.ctx,slot:t,isDraggingFromCurrentCtx:!!this.draggingBlocks,draggingBlocks:this.draggingBlocks,dataTransfer:e.dataTransfer,dropEffect:this.dropEffect,currentTarget:e.currentTarget,clientX:e.clientX,clientY:e.clientY,offsetX:e.offsetX,offsetY:e.offsetY});return u!==!1&&(u===void 0?(s=(l=this.hoveringBlock)==null?void 0:l.index)!=null?s:function(c,a,h){if(!c)return 0;let d=0;for(const m of c)d=Math.max(d,m.index+1);return d}(t.items):u);var s,l}}class Ft{constructor(t,e,o){this.type="slot",this.ctx=void 0,this.ownerBlock=void 0,this.items=new Set,this.info=void 0,this.handlePointerUp=()=>this.ctx.handleSlotPointerUp(this),this.handlePointerUpCapture=()=>this.ctx.handleSlotPointerUp(this,!0),this._isActive=!1,this.ctx=t,this.ownerBlock=e,e&&e.slots.add(this),this.info=o}createBlock(t){return this.ctx.createBlock(t,this)}get ref(){return this.info.ref}get isActive(){return this._isActive}get hasFocus(){return this.isActive&&this.ctx.hasFocus}_maybeUpdateActive(t){var e,o;return this._isActive!==t&&(this._isActive=t,(e=(o=this.info).onStatusChange)==null||e.call(o,this),!0)}select(){this.ctx.activeSlot=this,this.ctx.activeBlocks=this.ctx.options.multipleSelect?new Set(this.items):this.items.size?new Set([k(this.items)]):new Set,this.ctx.syncActiveElementStatus()}focus(){this.isActive||(this.ctx.activeBlocks.clear(),this.ctx.activeSlot=this,this.ctx.syncActiveElementStatus()),this.ctx.focus()}isDescendantOfBlock(t){let e=this.ownerBlock;for(;e;){var o;if(e===t)return!0;e=(o=e.ownerSlot)==null?void 0:o.ownerBlock}return!1}isDescendantOfSlot(t){var e;let o=(e=this.ownerBlock)==null?void 0:e.ownerSlot;for(;o;){var n;if(o===t)return!0;o=(n=o.ownerBlock)==null?void 0:n.ownerSlot}return!1}dispose(){var t;let e=!1;this.ctx.slotOfActiveBlocks===this&&(this.ctx.activeBlocks.clear(),e=!0),this.ctx.activeSlot===this&&(this.ctx.activeSlot=null,e=!0),e&&this.ctx.syncActiveElementStatus(),(t=this.ownerBlock)==null||t.slots.delete(this),this.items.forEach(o=>o.dispose()),this.items.clear(),this.info={}}}const ht={brand:"",deactivateHandlersWhenBlur:!0,navigateWithArrowKeys:!0,handleDeleteKey:!0,multipleSelect:!0,serializeForClipboard:i=>JSON.stringify(i),unserializeForClipboard:i=>JSON.parse(i)};class dt extends U{constructor(t={}){super(),this.hiddenInput=void 0,this._lastActiveElement=null,this.hasFocus=!1,this.options=void 0,this.brand="",this.uuid=`${Date.now().toString(36)}-${Math.random().toString(36)}`,this.dragging=new at(this),this.activeBlocks=new Set,this.slotOfActiveBlocks=null,this.activeSlot=null,this.lastActiveSlot=null,this.lastActiveBlocks=void 0,this.isFocusingBlock=void 0,this.isFocusingSlot=void 0,this.handleSlotPointerUp=(n,u)=>{!u&&this.isFocusingSlot||(this.isFocusingSlot=n)},this.handleBlockPointerUp=(n,u)=>{!u&&this.isFocusingBlock||(this.isFocusingBlock=n)},this.handleGlobalPointerUp=n=>{const u=this.isFocusingBlock,s=this.isFocusingSlot;this.isFocusingBlock=void 0,this.isFocusingSlot=void 0,u?(this.activeSlot=s||null,this.addBlockToSelection(u,n)):(this.activeSlot=s||null,this.options.deactivateHandlersWhenBlur&&this.activeBlocks.size>0&&this.activeBlocks.clear()),this.syncActiveElementStatus()},this.options=D({},ht,t),this.brand=String(this.options.brand),document.addEventListener("pointerup",this.handleGlobalPointerUp,!1);const e=this.hiddenInput=document.createElement("textarea");e.style.cssText="opacity:0;left:0;top:0;position:fixed;width:2px;height:2px",e.tabIndex=-1,e.inputMode="none",e.ownerDocument.body.appendChild(e);const o=n=>{var u;const s=this.options.serializeForClipboard(this.dumpSelectedData());s&&(n.preventDefault(),(u=n.clipboardData)==null||u.setData("text/plain",s))};e.addEventListener("copy",n=>{o(n)},!1),e.addEventListener("cut",n=>{o(n),this.deleteActiveBlocks()},!1),e.addEventListener("paste",n=>{n.preventDefault();try{var u;const s=(u=n.clipboardData)==null?void 0:u.getData("text/plain");if(!s)return;const l=this.options.unserializeForClipboard(s);this.pasteWithData(l)}catch(s){console.error("Failed to paste!",s)}},!1),e.addEventListener("focus",()=>{var n;this.hasFocus=!0,this.emit("focus",this),this.activeBlocks.forEach(u=>u.info.onStatusChange==null?void 0:u.info.onStatusChange(u)),(n=this.activeSlot)==null||n.info.onStatusChange==null||n.info.onStatusChange(this.activeSlot)},!1),e.addEventListener("blur",()=>{var n;this.hasFocus=!1,this._lastActiveElement=null,this.emit("blur",this),this.activeBlocks.forEach(u=>u.info.onStatusChange==null?void 0:u.info.onStatusChange(u)),(n=this.activeSlot)==null||n.info.onStatusChange==null||n.info.onStatusChange(this.activeSlot)},!1),e.addEventListener("keydown",n=>{const u=this.options;switch(n.code){case"KeyA":var s,l;u.multipleSelect&&(n.ctrlKey||n.metaKey)&&(this.activeBlocks=new Set(Array.from(((s=this.slotOfActiveBlocks)==null?void 0:s.items)||((l=this.activeSlot)==null?void 0:l.items)||[]).sort((c,a)=>c.index-a.index)),this.syncActiveElementStatus());break;case"ArrowUp":u.navigateWithArrowKeys&&this.activeNextBlock(-1,n.shiftKey||n.ctrlKey||n.metaKey);break;case"ArrowDown":u.navigateWithArrowKeys&&this.activeNextBlock(1,n.shiftKey||n.ctrlKey||n.metaKey);break;case"ArrowLeft":u.navigateWithArrowKeys&&this.activeParentBlock();break;case"ArrowRight":u.navigateWithArrowKeys&&this.activeChildrenBlocks();break;case"Delete":case"Backspace":u.handleDeleteKey&&this.deleteActiveBlocks();break;case"Tab":{const c=this._lastActiveElement;if(c&&"focus"in c){const a=c.tabIndex===-1&&c.querySelector("[tabIndex], button, textarea, input, select, a, [contentEditable]");a&&"focus"in a?a.focus():c.focus()}n.preventDefault()}}},!1)}focus(){document.activeElement!==this.hiddenInput&&(this._lastActiveElement=document.activeElement,this.hiddenInput.focus())}dumpSelectedData(){const t={isIBClipboardData:!0,ibContextBrand:this.brand,ibContextUUID:this.uuid,blocksData:[]};if(this.activeBlocks.forEach(e=>{t.blocksData.push(e.data)}),t.blocksData.length!==0)return t}copy(){this.hiddenInput.focus(),document.execCommand("copy")}pasteWithData(t,e){if(!q(t,this.brand))throw new Error("Need a valid IBClipboardData object");const o=this.activeSlot;if(!o)return;const n=k(this.activeBlocks),u=e!=null?e:o===(n==null?void 0:n.ownerSlot)?n.index:Math.max(0,...Array.from(o.items.values(),l=>1+l.index)),s=new Q({type:"paste",ctx:this,data:t,slot:o,index:u});o.info.onPaste==null||o.info.onPaste(s),this.emit("paste",s),s.returnValue!==!1&&setTimeout(()=>{const l=t.blocksData.length+u-1,c=Array.from(o.items).filter(a=>a.index>=u&&a.index<=l);c.length&&(this.activeSlot=o,this.activeBlocks.clear(),c.forEach(a=>this.activeBlocks.add(a)),this.syncActiveElementStatus())},100)}deleteActiveBlocks(){var t;const e=Array.from(this.activeBlocks.values()),o=(t=e[0])==null?void 0:t.ownerSlot;if(!o)return!1;const n=e[0].index,u=Array.from(e,l=>l.index),s=new Z({type:"cut",blocks:e,indexes:u,indexesDescending:u.slice().sort((l,c)=>c-l),ctx:this,slot:o});if(o.info.onCut==null||o.info.onCut(s),this.emit("cut",s),s.returnValue){const l=R(o.items,c=>c.index===n);l&&this.addBlockToSelection(l)}return s.returnValue}activeNextBlock(t,e=!1){const o=e&&this.options.multipleSelect;this.focus();let n=!0,u=Array.from(this.activeBlocks);var s;if(!u.length&&(u=Array.from(((s=this.activeSlot)==null?void 0:s.items)||[]),n=!1,!u.length))return;const l=u[0].ownerSlot;let c=u[0].index,a=c,h=u[0],d=h;u.slice(1).forEach(F=>{if(F.ownerSlot!==l)return;const p=F.index;p>c&&(c=p,h=F),p<a&&(a=p,d=F)});const m=t>0?c+t:a+t,v=R(l==null?void 0:l.items,F=>F.index===m);v?(o||this.activeBlocks.clear(),this.activeBlocks.add(v),this.activeSlot=l,this.syncActiveElementStatus()):n?o||(this.activeBlocks.clear(),u.length>1&&this.activeBlocks.add(t>0?h:d),this.syncActiveElementStatus()):(this.activeBlocks.clear(),o?u.forEach(F=>this.activeBlocks.add(F)):this.activeBlocks.add(t>0?d:h),this.syncActiveElementStatus())}activeParentBlock(){var t;const e=(t=this.activeSlot)==null?void 0:t.ownerBlock;this.activeSlot=(e==null?void 0:e.ownerSlot)||null,this.activeBlocks.clear(),e&&this.activeBlocks.add(e),this.syncActiveElementStatus()}activeChildrenBlocks(){const t=k(this.activeBlocks),e=k(t==null?void 0:t.slots);if(e){if(this.activeSlot=e,this.activeBlocks.clear(),this.options.multipleSelect)e.items.forEach(o=>this.activeBlocks.add(o));else{const o=k(e.items);o&&this.activeBlocks.add(o)}this.syncActiveElementStatus()}}syncActiveElementStatus(){var t;let e=!1;const o=this.lastActiveBlocks,n=this.lastActiveSlot,u=Array.from(this.activeBlocks),s=((t=u[0])==null?void 0:t.ownerSlot)||null;var l;u.length>1&&s!==this.activeSlot&&(this.activeSlot=s),!this.activeSlot&&s&&(this.activeSlot=s),u.forEach((c,a)=>{o==null||o.delete(c),e=c._maybeUpdateActiveNumber(a)||e}),o==null||o.forEach(c=>{e=c._maybeUpdateActiveNumber(!1)||e}),this.activeSlot!==n&&(n==null||n._maybeUpdateActive(!1),(l=this.activeSlot)==null||l._maybeUpdateActive(!0),this.lastActiveSlot=this.activeSlot,e=!0),this.lastActiveBlocks=new Set(this.activeBlocks),this.slotOfActiveBlocks=s,e&&this.emit("activeElementChanged",this)}clearSelection(){this.activeBlocks.clear(),this.activeSlot=null,this.syncActiveElementStatus()}addBlockToSelection(t,e){var o;if(e=(o=e)?o===!0?"ctrl":typeof o=="object"?o.ctrlKey||o.metaKey?"ctrl":o.shiftKey?"shift":"none":o==="ctrl"?"ctrl":o==="shift"?"shift":"none":"none",this.options.multipleSelect||(e="none"),e==="none")this.activeBlocks.clear(),this.activeBlocks.add(t);else{const n=k(this.activeBlocks);if(n&&n.ownerSlot!==t.ownerSlot){const u=[];for(let l=n;l&&l.ownerSlot;)u.push(l.ownerSlot),l=l.ownerSlot.ownerBlock;let s=-1;for(let l=t;l&&l.ownerSlot;l=l.ownerSlot.ownerBlock)if((s=u.indexOf(l.ownerSlot))!==-1){t=l;break}s===-1?this.activeBlocks.clear():s>0&&(this.activeBlocks=new Set(Array.from(this.activeBlocks,l=>{for(let c=s;c>0;c--,l=l.ownerSlot.ownerBlock);return l})))}this.activeSlot=t.ownerSlot||null,this.activeSlot||(e="ctrl")}if(e==="ctrl"&&this.activeBlocks.add(t),e==="shift"){const n=this.activeSlot,u=t.index;let s=u,l=u;this.activeBlocks.forEach(c=>{const a=c.index;s>a&&(s=a),l<a&&(l=a)}),this.activeBlocks=new Set(Array.from(n.items).filter(c=>{const a=c.index;return a>=s&&a<=l}).sort((c,a)=>c.index-a.index))}this.syncActiveElementStatus()}dispose(){var t;this.dragging.dispose(),(t=this.hiddenInput.parentElement)==null||t.removeChild(this.hiddenInput),document.removeEventListener("pointerup",this.handleGlobalPointerUp,!1)}createBlock(t,e=null){return new nt(this,e,t)}createSlot(t,e=null){return new Ft(this,e,t)}}const vt=()=>[{name:"\u{1F9E9} Click to Pick",children:[{name:"\u{1F36C} Alice"},{name:"\u{1F9F8} Bob"}]},{name:"Drag Card into slot \u{1F447}"},{name:"shortcut keys works too"}],pt=i=>{const t=[...i],e={};return{root:t,copiedBlocks:e,getSlotAndBlock(o){let n=t,u=null,s="";return o.forEach(l=>{if(s+=`/${l}`,!(s in e)){const c=n[l],a=_(x({},c),{children:[...c.children||[]]});n[l]=a,e[s]=a}u=e[s],n=u.children}),{slot:n,block:u}}}},ft=(i,t)=>{if("__demo_wholeReplace__"in t)return t.__demo_wholeReplace__;const e=pt(i),{slot:o,block:n}=e.getSlotAndBlock(t.path);if(t.rename&&n&&(n.name=t.rename.name),t.insert&&o.splice(t.insert.index,0,...t.insert.items),t.remove&&b(o,t.remove.indexes),t.moveInSlot){const{fromIndexes:u,toIndex:s}=t.moveInSlot;rt(o,u,s)}if(t.moveBetweenSlots){const{fromPath:u,fromIndexes:s,toIndex:l}=t.moveBetweenSlots,c=e.getSlotAndBlock(u).slot;lt(c,s,o,l)}return console.log("store reducer called",t,e),e.root},L=r.exports.createContext(null),mt=i=>{const t=r.exports.useReducer(ft,null,vt);return r.exports.createElement(L.Provider,{value:t},i.children)},S=()=>r.exports.useContext(L),y=r.exports.createContext(null),w=r.exports.createContext(null),I=r.exports.createContext(null),Bt=r.exports.memo(i=>{const t=r.exports.useRef(i),e=r.exports.useMemo(()=>new dt(i.options),[]);return t.current=i,r.exports.useEffect(()=>{var o,n;return(n=(o=t.current)===null||o===void 0?void 0:o.onMount)===null||n===void 0||n.call(o,e),()=>{var u,s;(s=(u=t.current)===null||u===void 0?void 0:u.onUnmount)===null||s===void 0||s.call(u,e),e.dispose()}},[]),r.exports.createElement(y.Provider,{value:e},r.exports.createElement(I.Provider,{value:null},r.exports.createElement(w.Provider,{value:null},i.children)))});function xt(i){const t=r.exports.useContext(y),e=r.exports.useContext(I);if(!t)throw new Error("No interactive-block BlockContext");const o=r.exports.useMemo(()=>{const u=e||t,s=i();return u.createSlot(s)},[]);return r.exports.useEffect(()=>function(){o.dispose()},[o]),r.exports.useMemo(()=>({blockContext:t,ownerBlock:e,slotHandler:o,handleSlotPointerUp(u){o.handlePointerUp(),K(u.currentTarget)&&t.focus()},SlotWrapper:u=>r.exports.createElement(w.Provider,{value:o},u.children)}),[])}function gt(i){const t=r.exports.useContext(y),e=r.exports.useContext(w);if(!t)throw new Error("No interactive-block BlockContext");const o=r.exports.useMemo(()=>{const u=e||t,s=i();return u.createBlock(s)},[]);return r.exports.useEffect(()=>function(){o.dispose()},[o]),r.exports.useMemo(()=>({blockContext:t,ownerSlot:e,blockHandler:o,handleBlockPointerUp(u){o.handlePointerUp(),K(u.currentTarget)&&t.focus()},BlockWrapper:u=>r.exports.createElement(I.Provider,{value:o},u.children)}),[])}function K(i){if(!i||typeof i.getRootNode!="function")return!1;const t=i.getRootNode();return t?t.activeElement===i:!1}const W=()=>{const[,i]=r.exports.useReducer(t=>(t+1)%16777215,0);return i},kt=i=>x({},i),St=i=>x({},i),B=i=>{const t=[];for(;i;)t.unshift(i.index),i=i.ownerSlot.ownerBlock;return t},A=(...i)=>i.filter(t=>!!t).map(t=>Array.isArray(t)?A(t):String(t)).join(" ");function Et(){const i=["\u{1F604}","\u{1F603}","\u{1F600}","\u{1F60A}","\u263A","\u{1F609}","\u{1F60D}","\u{1F618}","\u{1F61A}","\u{1F617}","\u{1F619}","\u{1F61C}","\u{1F61D}","\u{1F61B}","\u{1F633}","\u{1F601}","\u{1F614}","\u{1F60C}","\u{1F612}","\u{1F61E}","\u{1F623}","\u{1F622}","\u{1F602}","\u{1F62D}","\u{1F62A}","\u{1F625}","\u{1F630}","\u{1F605}","\u{1F613}","\u{1F629}","\u{1F62B}","\u{1F628}","\u{1F631}","\u{1F620}","\u{1F621}","\u{1F624}","\u{1F616}","\u{1F606}","\u{1F60B}","\u{1F637}","\u{1F60E}","\u{1F634}","\u{1F635}","\u{1F632}","\u{1F61F}","\u{1F626}","\u{1F627}","\u{1F608}","\u{1F47F}","\u{1F62E}","\u{1F62C}","\u{1F610}","\u{1F615}","\u{1F62F}","\u{1F636}","\u{1F607}","\u{1F60F}","\u{1F611}","\u{1F472}","\u{1F473}","\u{1F46E}","\u{1F477}","\u{1F482}","\u{1F476}","\u{1F466}","\u{1F467}","\u{1F468}","\u{1F469}","\u{1F474}","\u{1F475}","\u{1F471}","\u{1F47C}","\u{1F478}","\u{1F63A}","\u{1F638}","\u{1F63B}","\u{1F63D}","\u{1F63C}","\u{1F640}","\u{1F63F}","\u{1F639}","\u{1F63E}","\u{1F479}","\u{1F47A}","\u{1F648}","\u{1F649}","\u{1F64A}","\u{1F480}","\u{1F47D}","\u{1F4A9}","\u{1F525}","\u2728","\u{1F31F}","\u{1F4AB}","\u{1F4A5}","\u{1F4A2}","\u{1F4A6}","\u{1F4A7}","\u{1F4A4}","\u{1F4A8}","\u{1F442}","\u{1F440}","\u{1F443}","\u{1F445}","\u{1F444}","\u{1F44D}","\u{1F44E}","\u{1F44C}","\u{1F44A}","\u270A","\u270C","\u{1F44B}","\u270B","\u{1F450}","\u{1F446}","\u{1F447}","\u{1F449}","\u{1F448}","\u{1F64C}","\u{1F64F}","\u261D","\u{1F44F}","\u{1F4AA}","\u{1F6B6}","\u{1F3C3}","\u{1F483}","\u{1F46B}","\u{1F46A}","\u{1F46C}","\u{1F46D}","\u{1F48F}","\u{1F491}","\u{1F46F}","\u{1F646}","\u{1F645}","\u{1F481}","\u{1F64B}","\u{1F486}","\u{1F487}","\u{1F485}","\u{1F470}","\u{1F64E}","\u{1F64D}","\u{1F647}","\u{1F3A9}","\u{1F451}","\u{1F452}","\u{1F45F}","\u{1F45E}","\u{1F461}","\u{1F460}","\u{1F462}","\u{1F455}","\u{1F454}","\u{1F45A}","\u{1F457}","\u{1F3BD}","\u{1F456}","\u{1F458}","\u{1F459}","\u{1F4BC}","\u{1F45C}","\u{1F45D}","\u{1F45B}","\u{1F453}","\u{1F380}","\u{1F302}","\u{1F484}","\u{1F49B}","\u{1F499}","\u{1F49C}","\u{1F49A}","\u2764","\u{1F494}","\u{1F497}","\u{1F493}","\u{1F495}","\u{1F496}","\u{1F49E}","\u{1F498}","\u{1F48C}","\u{1F48B}","\u{1F48D}","\u{1F48E}","\u{1F464}","\u{1F465}","\u{1F4AC}","\u{1F463}","\u{1F4AD}","\u{1F436}","\u{1F43A}","\u{1F431}","\u{1F42D}","\u{1F439}","\u{1F430}","\u{1F438}","\u{1F42F}","\u{1F428}","\u{1F43B}","\u{1F437}","\u{1F43D}","\u{1F42E}","\u{1F417}","\u{1F435}","\u{1F412}","\u{1F434}","\u{1F411}","\u{1F418}","\u{1F43C}","\u{1F427}","\u{1F426}","\u{1F424}","\u{1F425}","\u{1F423}","\u{1F414}","\u{1F40D}","\u{1F422}","\u{1F41B}","\u{1F41D}","\u{1F41C}","\u{1F41E}","\u{1F40C}","\u{1F419}","\u{1F41A}","\u{1F420}","\u{1F41F}","\u{1F42C}","\u{1F433}","\u{1F40B}","\u{1F404}","\u{1F40F}","\u{1F400}","\u{1F403}","\u{1F405}","\u{1F407}","\u{1F409}","\u{1F40E}","\u{1F410}","\u{1F413}","\u{1F415}","\u{1F416}","\u{1F401}","\u{1F402}","\u{1F432}","\u{1F421}","\u{1F40A}","\u{1F42B}","\u{1F42A}","\u{1F406}","\u{1F408}","\u{1F429}","\u{1F43E}","\u{1F490}","\u{1F338}","\u{1F337}","\u{1F340}","\u{1F339}","\u{1F33B}","\u{1F33A}","\u{1F341}","\u{1F343}","\u{1F342}","\u{1F33F}","\u{1F33E}","\u{1F344}","\u{1F335}","\u{1F334}","\u{1F332}","\u{1F333}","\u{1F330}","\u{1F331}","\u{1F33C}","\u{1F310}","\u{1F31E}","\u{1F31D}","\u{1F31A}","\u{1F311}","\u{1F312}","\u{1F313}","\u{1F314}","\u{1F315}","\u{1F316}","\u{1F317}","\u{1F318}","\u{1F31C}","\u{1F31B}","\u{1F319}","\u{1F30D}","\u{1F30E}","\u{1F30F}","\u{1F30B}","\u{1F30C}","\u{1F320}","\u2B50","\u2600","\u26C5","\u2601","\u26A1","\u2614","\u2744","\u26C4","\u{1F300}","\u{1F301}","\u{1F308}","\u{1F30A}","\u{1F38D}","\u{1F49D}","\u{1F38E}","\u{1F392}","\u{1F393}","\u{1F38F}","\u{1F386}","\u{1F387}","\u{1F390}","\u{1F391}","\u{1F383}","\u{1F47B}","\u{1F385}","\u{1F384}","\u{1F381}","\u{1F38B}","\u{1F389}","\u{1F38A}","\u{1F388}","\u{1F38C}","\u{1F52E}","\u{1F3A5}","\u{1F4F7}","\u{1F4F9}","\u{1F4FC}","\u{1F4BF}","\u{1F4C0}","\u{1F4BD}","\u{1F4BE}","\u{1F4BB}","\u{1F4F1}","\u260E","\u{1F4DE}","\u{1F4DF}","\u{1F4E0}","\u{1F4E1}","\u{1F4FA}","\u{1F4FB}","\u{1F50A}","\u{1F509}","\u{1F508}","\u{1F507}","\u{1F514}","\u{1F515}","\u{1F4E2}","\u{1F4E3}","\u23F3","\u231B","\u23F0","\u231A","\u{1F513}","\u{1F512}","\u{1F50F}","\u{1F510}","\u{1F511}","\u{1F50E}","\u{1F4A1}","\u{1F526}","\u{1F506}","\u{1F505}","\u{1F50C}","\u{1F50B}","\u{1F50D}","\u{1F6C1}","\u{1F6C0}","\u{1F6BF}","\u{1F6BD}","\u{1F527}","\u{1F529}","\u{1F528}","\u{1F6AA}","\u{1F6AC}","\u{1F4A3}","\u{1F52B}","\u{1F52A}","\u{1F48A}","\u{1F489}","\u{1F4B0}","\u{1F4B4}","\u{1F4B5}","\u{1F4B7}","\u{1F4B6}","\u{1F4B3}","\u{1F4B8}","\u{1F4F2}","\u{1F4E7}","\u{1F4E5}","\u{1F4E4}","\u2709","\u{1F4E9}","\u{1F4E8}","\u{1F4EF}","\u{1F4EB}","\u{1F4EA}","\u{1F4EC}","\u{1F4ED}","\u{1F4EE}","\u{1F4E6}","\u{1F4DD}","\u{1F4C4}","\u{1F4C3}","\u{1F4D1}","\u{1F4CA}","\u{1F4C8}","\u{1F4C9}","\u{1F4DC}","\u{1F4CB}","\u{1F4C5}","\u{1F4C6}","\u{1F4C7}","\u{1F4C1}","\u{1F4C2}","\u2702","\u{1F4CC}","\u{1F4CE}","\u2712","\u270F","\u{1F4CF}","\u{1F4D0}","\u{1F4D5}","\u{1F4D7}","\u{1F4D8}","\u{1F4D9}","\u{1F4D3}","\u{1F4D4}","\u{1F4D2}","\u{1F4DA}","\u{1F4D6}","\u{1F516}","\u{1F4DB}","\u{1F52C}","\u{1F52D}","\u{1F4F0}","\u{1F3A8}","\u{1F3AC}","\u{1F3A4}","\u{1F3A7}","\u{1F3BC}","\u{1F3B5}","\u{1F3B6}","\u{1F3B9}","\u{1F3BB}","\u{1F3BA}","\u{1F3B7}","\u{1F3B8}","\u{1F47E}","\u{1F3AE}","\u{1F0CF}","\u{1F3B4}","\u{1F004}","\u{1F3B2}","\u{1F3AF}","\u{1F3C8}","\u{1F3C0}","\u26BD","\u26BE","\u{1F3BE}","\u{1F3B1}","\u{1F3C9}","\u{1F3B3}","\u26F3","\u{1F6B5}","\u{1F6B4}","\u{1F3C1}","\u{1F3C7}","\u{1F3C6}","\u{1F3BF}","\u{1F3C2}","\u{1F3CA}","\u{1F3C4}","\u{1F3A3}","\u2615","\u{1F375}","\u{1F376}","\u{1F37C}","\u{1F37A}","\u{1F37B}","\u{1F378}","\u{1F379}","\u{1F377}","\u{1F374}","\u{1F355}","\u{1F354}","\u{1F35F}","\u{1F357}","\u{1F356}","\u{1F35D}","\u{1F35B}","\u{1F364}","\u{1F371}","\u{1F363}","\u{1F365}","\u{1F359}","\u{1F358}","\u{1F35A}","\u{1F35C}","\u{1F372}","\u{1F362}","\u{1F361}","\u{1F373}","\u{1F35E}","\u{1F369}","\u{1F36E}","\u{1F366}","\u{1F368}","\u{1F367}","\u{1F382}","\u{1F370}","\u{1F36A}","\u{1F36B}","\u{1F36C}","\u{1F36D}","\u{1F36F}","\u{1F34E}","\u{1F34F}","\u{1F34A}","\u{1F34B}","\u{1F352}","\u{1F347}","\u{1F349}","\u{1F353}","\u{1F351}","\u{1F348}","\u{1F34C}","\u{1F350}","\u{1F34D}","\u{1F360}","\u{1F346}","\u{1F345}","\u{1F33D}","\u{1F3E0}","\u{1F3E1}","\u{1F3EB}","\u{1F3E2}","\u{1F3E3}","\u{1F3E5}","\u{1F3E6}","\u{1F3EA}","\u{1F3E9}","\u{1F3E8}","\u{1F492}","\u26EA","\u{1F3EC}","\u{1F3E4}","\u{1F307}","\u{1F306}","\u{1F3EF}","\u{1F3F0}","\u26FA","\u{1F3ED}","\u{1F5FC}","\u{1F5FE}","\u{1F5FB}","\u{1F304}","\u{1F305}","\u{1F303}","\u{1F5FD}","\u{1F309}","\u{1F3A0}","\u{1F3A1}","\u26F2","\u{1F3A2}","\u{1F6A2}","\u26F5","\u{1F6A4}","\u{1F6A3}","\u2693","\u{1F680}","\u2708","\u{1F4BA}","\u{1F681}","\u{1F682}","\u{1F68A}","\u{1F689}","\u{1F69E}","\u{1F686}","\u{1F684}","\u{1F685}","\u{1F688}","\u{1F687}","\u{1F69D}","\u{1F68B}","\u{1F683}","\u{1F68E}","\u{1F68C}","\u{1F68D}","\u{1F699}","\u{1F698}","\u{1F697}","\u{1F695}","\u{1F696}","\u{1F69B}","\u{1F69A}","\u{1F6A8}","\u{1F693}","\u{1F694}","\u{1F692}","\u{1F691}","\u{1F690}","\u{1F6B2}","\u{1F6A1}","\u{1F69F}","\u{1F6A0}","\u{1F69C}","\u{1F488}","\u{1F68F}","\u{1F3AB}","\u{1F6A6}","\u{1F6A5}","\u26A0","\u{1F6A7}","\u{1F530}","\u26FD","\u{1F3EE}","\u{1F3B0}","\u2668","\u{1F5FF}","\u{1F3AA}","\u{1F3AD}","\u{1F4CD}","\u{1F6A9}","\u2B06","\u2B07","\u2B05","\u27A1","\u{1F520}","\u{1F521}","\u{1F524}","\u2197","\u2196","\u2198","\u2199","\u2194","\u2195","\u{1F504}","\u25C0","\u25B6","\u{1F53C}","\u{1F53D}","\u21A9","\u21AA","\u2139","\u23EA","\u23E9","\u23EB","\u23EC","\u2935","\u2934","\u{1F197}","\u{1F500}","\u{1F501}","\u{1F502}","\u{1F195}","\u{1F199}","\u{1F192}","\u{1F193}","\u{1F196}","\u{1F4F6}","\u{1F3A6}","\u{1F201}","\u{1F22F}","\u{1F233}","\u{1F235}","\u{1F234}","\u{1F232}","\u{1F250}","\u{1F239}","\u{1F23A}","\u{1F236}","\u{1F21A}","\u{1F6BB}","\u{1F6B9}","\u{1F6BA}","\u{1F6BC}","\u{1F6BE}","\u{1F6B0}","\u{1F6AE}","\u{1F17F}","\u267F","\u{1F6AD}","\u{1F237}","\u{1F238}","\u{1F202}","\u24C2","\u{1F6C2}","\u{1F6C4}","\u{1F6C5}","\u{1F6C3}","\u{1F251}","\u3299","\u3297","\u{1F191}","\u{1F198}","\u{1F194}","\u{1F6AB}","\u{1F51E}","\u{1F4F5}","\u{1F6AF}","\u{1F6B1}","\u{1F6B3}","\u{1F6B7}","\u{1F6B8}","\u26D4","\u2733","\u2747","\u274E","\u2705","\u2734","\u{1F49F}","\u{1F19A}","\u{1F4F3}","\u{1F4F4}","\u{1F170}","\u{1F171}","\u{1F18E}","\u{1F17E}","\u{1F4A0}","\u27BF","\u267B","\u2648","\u2649","\u264A","\u264B","\u264C","\u264D","\u264E","\u264F","\u2650","\u2651","\u2652","\u2653","\u26CE","\u{1F52F}","\u{1F3E7}","\u{1F4B9}","\u{1F4B2}","\u{1F4B1}","\xA9","\xAE","\u2122","\u303D","\u3030","\u{1F51D}","\u{1F51A}","\u{1F519}","\u{1F51B}","\u{1F51C}","\u274C","\u2B55","\u2757","\u2753","\u2755","\u2754","\u{1F503}","\u{1F55B}","\u{1F567}","\u{1F550}","\u{1F55C}","\u{1F551}","\u{1F55D}","\u{1F552}","\u{1F55E}","\u{1F553}","\u{1F55F}","\u{1F554}","\u{1F560}","\u{1F555}","\u{1F556}","\u{1F557}","\u{1F558}","\u{1F559}","\u{1F55A}","\u{1F561}","\u{1F562}","\u{1F563}","\u{1F564}","\u{1F565}","\u{1F566}","\u2716","\u2795","\u2796","\u2797","\u2660","\u2665","\u2663","\u2666","\u{1F4AE}","\u{1F4AF}","\u2714","\u2611","\u{1F518}","\u{1F517}","\u27B0","\u{1F531}","\u{1F532}","\u{1F533}","\u25FC","\u25FB","\u25FE","\u25FD","\u25AA","\u25AB","\u{1F53A}","\u2B1C","\u2B1B","\u26AB","\u26AA","\u{1F534}","\u{1F535}","\u{1F53B}","\u{1F536}","\u{1F537}","\u{1F538}","\u{1F539}"];return i[Math.floor(Math.random()*i.length)]}const $=r.exports.memo(function(t){var m;const[,e]=S(),o=W(),{ownerBlock:n,blockContext:u,slotHandler:s,handleSlotPointerUp:l,SlotWrapper:c}=xt(()=>({onCut:v=>e({path:B(n),remove:{indexes:v.blocks.map(F=>F.index)}}),onPaste:v=>e({path:B(n),insert:{index:v.index,items:v.data.blocksData.map(kt)}}),onStatusChange:()=>o(),onDragHoverStatusChange:()=>o(),onMoveInSlot:v=>e({path:B(n),moveInSlot:{fromIndexes:v.blocks.map(F=>F.index),toIndex:v.index}}),onMoveToThisSlot:v=>{var F;return e({path:B(n),moveBetweenSlots:{fromPath:B((F=v.fromSlot)==null?void 0:F.ownerBlock),fromIndexes:v.blocks.map(p=>p.index),toIndex:v.index}})}})),a=r.exports.useMemo(()=>u.dragging.getDefaultSlotEventHandlers(s,"react"),[]),{isActive:h,isDragHovering:d}=s;return r.exports.createElement("div",x({className:A("mySlot",h&&"isActive",d&&"isDragHovering"),tabIndex:-1,onPointerUp:l},a),r.exports.createElement(c,null,((m=t.children)==null?void 0:m.length)>0?t.children:r.exports.createElement("div",{className:"mySlot-emptyPlaceholder"},"Empty")),s.isDragHovering&&r.exports.createElement("div",{className:"mySlot-indexToDrop",key:"indexToDrop",style:{gridRowStart:s.indexToDrop+1}},`indexToDrop = ${s.indexToDrop}`))}),At=r.exports.memo(function i(t){var p;const{index:e,item:o}=t,[,n]=S(),u=W(),s=r.exports.useRef();r.exports.useImperativeHandle(s,()=>({index:e,item:o}),[e,o]);const{blockContext:l,blockHandler:c,handleBlockPointerUp:a,BlockWrapper:h}=gt(()=>({data:()=>St(s.current.item),index:()=>s.current.index,onStatusChange:()=>u()})),d=r.exports.useMemo(()=>l.dragging.getDefaultBlockEventHandlers(c,"react"),[]),m=r.exports.useCallback(()=>{var T;const C=B(c),E={name:`${Et()} ${(~~(Math.random()*1e6+1e6)).toString(16).slice(-4).toUpperCase()}`};n({path:C,insert:{index:((T=o.children)==null?void 0:T.length)||0,items:[E]}})},[c]),{activeNumber:v,isActive:F}=c;return r.exports.createElement(h,null,r.exports.createElement("div",x({className:A("myBlock",F&&"isActive"),tabIndex:-1,onPointerUp:a,draggable:!0},d),F&&r.exports.createElement("div",{className:"myBlock-selectIndex"},v+1),r.exports.createElement(Ct,{name:o.name,blockHandler:c}),r.exports.createElement($,null,((p=o.children)==null?void 0:p.length)?o.children.map((C,E)=>r.exports.createElement(i,{key:E,index:E,item:C})):null,r.exports.createElement("button",{className:"myBlock-addButton",onClick:m},"Create..."))))}),Ct=i=>{const[,t]=S(),e=r.exports.useCallback(o=>{const n=i.blockHandler,u=B(n),s=o.currentTarget.value;t({path:u,rename:{name:s}})},[]);return r.exports.createElement("input",{className:"blockNameInput",type:"text",value:i.name,onChange:e})},Dt=()=>{const[i,t]=S(),e=r.exports.useRef(null);r.exports.useEffect(()=>{e.current.value=JSON.stringify(i,null,2)},[i]);const o=r.exports.useRef(null);o.current=i;const n=r.exports.useCallback((l=!0)=>{try{const c=JSON.parse(e.current.value);t({path:[],__demo_wholeReplace__:c})}catch(c){l&&(e.current.value=JSON.stringify(o.current,null,2)),console.error("Failed to replace: ",c)}},[]),u=r.exports.useCallback(()=>n(!0),[]),s=r.exports.useCallback(()=>n(!1),[]);return r.exports.createElement("div",null,r.exports.createElement("h3",null,"How to Play"),r.exports.createElement("ol",null,r.exports.createElement("li",null,"click to ",r.exports.createElement("b",null,"pick block & slot")),r.exports.createElement("li",null,r.exports.createElement("b",null,"multiple-select")," with ",r.exports.createElement("kbd",null,"Ctrl")," or ",r.exports.createElement("kbd",null,"Shift")),r.exports.createElement("li",null,r.exports.createElement("b",null,"navigate")," with arrow keys"),r.exports.createElement("li",null,r.exports.createElement("b",null,"copy, cut, paste")," with ",r.exports.createElement("kbd",null,"Ctrl+C")," / ",r.exports.createElement("kbd",null,"Ctrl+X")," / ",r.exports.createElement("kbd",null,"Ctrl+V")),r.exports.createElement("li",null,"Drag and drop. Also supports cross-window dragging.")),r.exports.createElement("h3",null,"Current Data"),r.exports.createElement("textarea",{className:"demoPage-store",spellCheck:!1,ref:e,onBlur:u,onInput:s}))},bt=function(){const[i]=S(),[t,e]=r.exports.useState(!1),o=r.exports.useCallback(n=>{n.on("focus",()=>e(!0)),n.on("blur",()=>e(!1)),n.on("paste",u=>{console.log("pasting...",u)}),window.blockContext=n},[]);return r.exports.createElement(Bt,{onMount:o},It,r.exports.createElement("div",{className:A("demoPage",t&&"hasFocus")},r.exports.createElement("div",{className:"demoPage-introductionArea"},r.exports.createElement(Dt,null)),r.exports.createElement("div",{className:"demoPage-blockArea"},r.exports.createElement($,null,i.map((n,u)=>r.exports.createElement(At,{key:u,index:u,item:n}))))))},yt="https://github.com/lyonbot/interactive-blocks",wt="https://lyonbot.github.io/interactive-blocks/docs/",It=r.exports.createElement(r.exports.Fragment,null,r.exports.createElement("h2",null,"InteractiveBlocks"),r.exports.createElement("p",null,"Just proving the abilities with shabby Slot and Block components here."),r.exports.createElement("p",null,"Learn how to integrate with your own components? ",r.exports.createElement("a",{href:wt,target:"_blank"},"Read the Document \xBB")),r.exports.createElement("a",{className:"demoPage-forkMe",href:yt,target:"_blank"},"Fork me on GitHub")),Tt=document.getElementById("app"),Pt=Y(Tt);Pt.render(r.exports.createElement(mt,null,r.exports.createElement(bt,null)));