var Q=Object.defineProperty,Z=Object.defineProperties;var tt=Object.getOwnPropertyDescriptors;var N=Object.getOwnPropertySymbols;var et=Object.prototype.hasOwnProperty,ut=Object.prototype.propertyIsEnumerable;var $=(n,t,e)=>t in n?Q(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,S=(n,t)=>{for(var e in t||(t={}))et.call(t,e)&&$(n,e,t[e]);if(N)for(var e of N(t))ut.call(t,e)&&$(n,e,t[e]);return n},L=(n,t)=>Z(n,tt(t));import{D as T,F as I,p as K,v as a,s as y,y as H,g as M,d as D,A as g,_ as ot,l as it,a as st,S as nt}from"./vendor.604cfa3c.js";const lt=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))u(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&u(s)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function u(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}};lt();function P(){return P=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var u in e)Object.prototype.hasOwnProperty.call(e,u)&&(n[u]=e[u])}return n},P.apply(this,arguments)}const j=(n,t,e)=>{const u=n._listeners;u[t]?u[t].push(e):u[t]=[e]};class V{constructor(){this._listeners={}}on(t,e){return j(this,t,{listener:e}),this}once(t,e){return j(this,t,{listener:e,once:!0}),this}off(t,e){const u=this._listeners[t];if(!u)return this;if(u.length===1&&e===u[0].listener)return this._listeners[t]=null,this;const o=u.findIndex(i=>i.listener===e);return o!==-1&&u.splice(o,1),this}emit(t,...e){const u=this._listeners[t];if(!u)return;let o=!1;u.forEach(i=>{i.listener(e),i.once&&(o=!0)}),o&&(this._listeners[t]=u.filter(i=>!i.once))}removeAllListeners(){return this._listeners={},this}}function rt(n,t){return!(typeof n!="object"||!n||n.isIBClipboardData!==!0||typeof t=="string"&&t!==n.ibContextBrand||typeof n.ibContextBrand!="string"||"ibContextUUID"in n&&typeof n.ibContextUUID!="string"||!Array.isArray(n.blocksData)||n.blocksData.some(e=>typeof e!="object"||e===null))}const k=()=>function(n){Object.assign(this,n),this.returnValue=!0,this.preventDefault=()=>{this.returnValue=!1}},ct=k(),at=k(),Ft=k(),ht=k(),dt=k(),vt=k(),W=(n,t)=>typeof n=="function"?n(t):n;class ft{get activeNumber(){return this._activeNumber}get isActive(){return this._activeNumber!==!1}get hasFocus(){return this.isActive&&this.ctx.hasFocus}get ref(){return this.info.ref}_maybeUpdateActiveNumber(t){var e,u;return this._activeNumber!==t&&(this._activeNumber=t,(e=(u=this.info).onStatusChange)==null||e.call(u,this),!0)}select(t){this.ctx.addBlockToSelection(this,t)}unselect(){this.isActive&&(this.ctx.activeBlocks.delete(this),this.ctx.syncActiveElementStatus())}focus(t){this.isActive||this.select(t),this.ctx.focus()}constructor(t,e,u){this.type="block",this.ctx=void 0,this.ownerSlot=void 0,this.slots=new Set,this.info=void 0,this._activeNumber=!1,this.handlePointerUp=()=>this.ctx.handleBlockPointerUp(this,!1),this.handlePointerUpCapture=()=>this.ctx.handleBlockPointerUp(this,!0),this.ctx=t,this.ownerSlot=e,e&&e.items.add(this),this.info=u}get index(){return W(this.info.index,this)}get data(){return W(this.info.data,this)}createSlot(t){return this.ctx.createSlot(t,this)}dispose(){var t;this.ctx.activeBlocks.has(this)&&(this.ctx.activeBlocks.delete(this),this.ctx.syncActiveElementStatus()),(t=this.ownerSlot)==null||t.items.delete(this),this.slots.forEach(e=>e.dispose()),this.slots.clear(),this.info=Bt}}const Bt={index:()=>{throw new Error("Accessing a disposed block")},data:()=>{throw new Error("Accessing a disposed block")}};function pt(n,t){let e,u;function o(s=!1){e&&(s&&u&&n(...u),clearTimeout(e),e=null,u=void 0)}const i=function(...s){u=s,e||(e=setTimeout(()=>o(!0),t))};return i.cancel=()=>o(!1),i.flush=()=>o(!0),i}function _(n,t){const e=t.map(u=>n[u]).filter(u=>u!==void 0);return[...t].sort((u,o)=>o-u).forEach(u=>n.splice(u,1)),e}function gt(n,t,e){const u=_(n,t);n.splice(e,0,...u)}function mt(n,t,e,u){const o=_(n,t);e.splice(u,0,...o)}function z(n,t){if(t==="camelCase")return n;const e={};return Object.keys(n).forEach(u=>{var o;let i=u;t==="react"&&(i=`on${(o=i[0])==null?void 0:o.toUpperCase()}${i.substr(1)}`),t==="lowercase"&&(i=i.toLowerCase()),e[i]=n[u]}),e}function R(n,t){if(!n)return;let e=0;for(const u of n){if(t(u,e))return u;e+=1}}function A(n){if(n)return n[Symbol.iterator]().next().value}const St="webkitRequestAnimationFrame"in window,B=document.createElement("div");B.style.cssText="position:fixed;pointer-events:none;left:0;top:0;background: #FFF; border: 1px solid #000; padding: 4px 8px;transform:translate(-50%, -50%)";class kt extends V{constructor(t){super(),this.ctx=void 0,this.draggingBlocks=void 0,this.slotOfDraggingBlocks=void 0,this.isHovering=!1,this.hoveringSlot=void 0,this.hoveringBlock=void 0,this.dropEffect=void 0,this.setHoveringSlot=pt(this._originalSetHoveringSlot.bind(this),50),this.ctx=t}dispose(){this.removeAllListeners(),this.setHoveringSlot.cancel()}_originalSetHoveringSlot(t,e){var u;if(t&&typeof e!="number")throw new Error("Cannot setHoveringSlot with indexToDrop unknown");if(t===this.hoveringSlot)return void(t&&t.indexToDrop!==e&&(t.indexToDrop=e,t.info.onDragHoverStatusChange==null||t.info.onDragHoverStatusChange(this.ctx),this.emit("hoverChanged",this.ctx)));const o=this.hoveringSlot;((u=this.hoveringBlock)==null?void 0:u.ownerSlot)!==t&&(this.hoveringBlock=void 0),this.hoveringSlot=t,this.isHovering=!!t,o&&(o.isDragHovering=!1,o.indexToDrop=void 0,o.info.onDragHoverStatusChange==null||o.info.onDragHoverStatusChange(this.ctx)),t&&(t.isDragHovering=!0,t.indexToDrop=e,t.info.onDragHoverStatusChange==null||t.info.onDragHoverStatusChange(this.ctx)),this.emit("hoverChanged",this.ctx)}getDefaultBlockEventHandlers(t,e){return z({dragStart:this.handleBlockDragStart.bind(this,t),dragEnd:this.handleBlockDragEnd.bind(this,t),dragOver:this.handleBlockDragOver.bind(this,t),dragLeave:this.handleBlockDragLeave.bind(this,t)},e)}handleBlockDragStart(t,e){const u=e.dataTransfer;if(!u)return;this.ctx.activeBlocks.has(t)||this.ctx.addBlockToSelection(t,"none");const o=this.ctx.options.serializeForClipboard(this.ctx.dumpSelectedData());if(!o)return;const i=Array.from(this.ctx.activeBlocks),s=new dt({type:"blockDragStart",text:o,blocks:i,ctx:this.ctx,currentBlock:t,dataTransfer:u,event:e});if(t.info.onDragStart==null||t.info.onDragStart(s),this.emit("blockDragStart",s),s.returnValue===!1)return;e.stopPropagation(),u.setData("text/plain",s.text),u.setData("x-block-context/uuid",this.ctx.uuid),u.setData(`x-block-context/brand-${this.ctx.brand}`,"true"),i.length>1&&(document.body.appendChild(B),B.style.left=`${e.clientX}px`,B.style.top=`${e.clientY}px`,setTimeout(()=>B.remove(),100),B.textContent=`${i.length} items`,u.setDragImage(B,B.offsetWidth/2,B.offsetHeight/2));const l=this.ctx.slotOfActiveBlocks;this.draggingBlocks=i,this.slotOfDraggingBlocks=l||void 0,l&&(this.setHoveringSlot(l,t.index),this.setHoveringSlot.flush())}handleBlockDragEnd(t,e){this.slotOfDraggingBlocks=void 0,this.draggingBlocks=void 0,this.setHoveringSlot(void 0)}handleBlockDragOver(t){this.hoveringBlock!==t&&t.ownerSlot==this.hoveringSlot&&(this.hoveringBlock=t,this.emit("hoverChanged",this.ctx))}handleBlockDragLeave(t){this.hoveringBlock===t&&(this.hoveringBlock=void 0,this.emit("hoverChanged",this.ctx))}getDefaultSlotEventHandlers(t,e){return z({dragOver:u=>{this.handleSlotDragOver(t,u)&&(u.preventDefault(),u.stopPropagation())},dragLeave:u=>{this.handleSlotDragLeave(t),u.preventDefault(),u.stopPropagation()},drop:u=>{this.handleSlotDrop(t,u),u.preventDefault(),u.stopPropagation()}},e)}handleSlotDragOver(t,e){var u;if((u=e.dataTransfer)!=null&&u.types.includes("x-block-context/uuid")&&!e.dataTransfer.types.includes(`x-block-context/brand-${this.ctx.brand}`))return!1;const o=this.computeIndexToDrop(t,e);return o!==!1&&(this.setHoveringSlot(t,o),!0)}handleSlotDrop(t,e){const u=this.computeIndexToDrop(t,e);if(u===!1)return;const o=this.dropEffect,i=this.draggingBlocks,s=this.ctx,l=new vt({type:"slotBeforeDrop",ctx:s,slot:t,dropEffect:o,dataTransfer:e.dataTransfer,event:e,indexToDrop:u,isDraggingFromCurrentCtx:!!i,draggingBlocks:i});if(this.emit("slotBeforeDrop",l),l.returnValue===!1)return this.setHoveringSlot(void 0),void this.setHoveringSlot.flush();if(this.setHoveringSlot(t,u),this.setHoveringSlot.flush(),i&&o!=="copy")if(t===s.slotOfActiveBlocks){const r=u-i.filter(d=>d.index<u).length,c=new Ft({type:"moveInSlot",blocks:i,ctx:s,slot:t,index:r});if(t.info.onMoveInSlot==null||t.info.onMoveInSlot(c),s.emit("moveInSlot",c),!c.returnValue)return;setTimeout(()=>{s.activeSlot=t,s.activeBlocks.clear(),t.items.forEach(d=>{const h=d.index;h>=r&&h<r+i.length&&s.activeBlocks.add(d)}),s.syncActiveElementStatus(),s.focus()},100)}else{const r=u,c=new ht({type:"moveBetweenSlots",blocks:i,ctx:s,fromSlot:s.slotOfActiveBlocks,toSlot:t,index:r});if(t.info.onMoveToThisSlot==null||t.info.onMoveToThisSlot(c),s.emit("moveBetweenSlots",c),!c.returnValue)return;setTimeout(()=>{s.activeSlot=t,s.activeBlocks.clear(),t.items.forEach(d=>{const h=d.index;h>=r&&h<r+i.length&&s.activeBlocks.add(d)}),s.syncActiveElementStatus(),s.focus()},100)}else try{const r=this.ctx.options.unserializeForClipboard(e.dataTransfer.getData("text/plain"));s.activeSlot=t,s.activeBlocks.clear(),s.syncActiveElementStatus(),s.pasteWithData(r,u),s.focus()}catch(r){console.error("Failed to drop")}this.setHoveringSlot(void 0)}handleSlotDragLeave(t){this.setHoveringSlot(void 0)}computeIndexToDrop(t,e){var u;let o=e.dataTransfer.dropEffect;if(o==="none"&&St&&(o=e.ctrlKey||e.altKey?"copy":"move"),this.dropEffect=o,this.dropEffect!=="copy"&&(u=this.draggingBlocks)!=null&&u.some(r=>t.isDescendantOfBlock(r)))return!1;const i=t.info.computeIndexToDrop==null?void 0:t.info.computeIndexToDrop({ctx:this.ctx,slot:t,isDraggingFromCurrentCtx:!!this.draggingBlocks,draggingBlocks:this.draggingBlocks,dataTransfer:e.dataTransfer,dropEffect:this.dropEffect,currentTarget:e.currentTarget,clientX:e.clientX,clientY:e.clientY,offsetX:e.offsetX,offsetY:e.offsetY});return i!==!1&&(i===void 0?(s=(l=this.hoveringBlock)==null?void 0:l.index)!=null?s:function(r,c,d){if(!r)return 0;let h=0;for(const F of r)h=Math.max(h,F.index+1);return h}(t.items):i);var s,l}}class At{constructor(t,e,u){this.type="slot",this.ctx=void 0,this.ownerBlock=void 0,this.items=new Set,this.info=void 0,this.handlePointerUp=()=>this.ctx.handleSlotPointerUp(this),this.handlePointerUpCapture=()=>this.ctx.handleSlotPointerUp(this,!0),this._isActive=!1,this.ctx=t,this.ownerBlock=e,e&&e.slots.add(this),this.info=u}createBlock(t){return this.ctx.createBlock(t,this)}get ref(){return this.info.ref}get isActive(){return this._isActive}get hasFocus(){return this.isActive&&this.ctx.hasFocus}_maybeUpdateActive(t){var e,u;return this._isActive!==t&&(this._isActive=t,(e=(u=this.info).onStatusChange)==null||e.call(u,this),!0)}select(){this.ctx.activeSlot=this,this.ctx.activeBlocks=this.ctx.options.multipleSelect?new Set(this.items):this.items.size?new Set([A(this.items)]):new Set,this.ctx.syncActiveElementStatus()}focus(){this.isActive||(this.ctx.activeBlocks.clear(),this.ctx.activeSlot=this,this.ctx.syncActiveElementStatus()),this.ctx.focus()}isDescendantOfBlock(t){let e=this.ownerBlock;for(;e;){var u;if(e===t)return!0;e=(u=e.ownerSlot)==null?void 0:u.ownerBlock}return!1}isDescendantOfSlot(t){var e;let u=(e=this.ownerBlock)==null?void 0:e.ownerSlot;for(;u;){var o;if(u===t)return!0;u=(o=u.ownerBlock)==null?void 0:o.ownerSlot}return!1}dispose(){var t;let e=!1;this.ctx.slotOfActiveBlocks===this&&(this.ctx.activeBlocks.clear(),e=!0),this.ctx.activeSlot===this&&(this.ctx.activeSlot=null,e=!0),e&&this.ctx.syncActiveElementStatus(),(t=this.ownerBlock)==null||t.slots.delete(this),this.items.forEach(u=>u.dispose()),this.items.clear(),this.info={}}}const xt={brand:"",deactivateHandlersWhenBlur:!0,navigateWithArrowKeys:!0,handleDeleteKey:!0,multipleSelect:!0,serializeForClipboard:n=>JSON.stringify(n),unserializeForClipboard:n=>JSON.parse(n)};class Dt extends V{constructor(t={}){super(),this.hiddenInput=void 0,this._lastActiveElement=null,this.hasFocus=!1,this.options=void 0,this.brand="",this.uuid=`${Date.now().toString(36)}-${Math.random().toString(36)}`,this.dragging=new kt(this),this.activeBlocks=new Set,this.slotOfActiveBlocks=null,this.activeSlot=null,this.lastActiveSlot=null,this.lastActiveBlocks=void 0,this.isFocusingBlock=void 0,this.isFocusingSlot=void 0,this.handleSlotPointerUp=(o,i)=>{!i&&this.isFocusingSlot||(this.isFocusingSlot=o)},this.handleBlockPointerUp=(o,i)=>{!i&&this.isFocusingBlock||(this.isFocusingBlock=o)},this.handleGlobalPointerUp=o=>{const i=this.isFocusingBlock,s=this.isFocusingSlot;this.isFocusingBlock=void 0,this.isFocusingSlot=void 0,i?(this.activeSlot=s||null,this.addBlockToSelection(i,o)):(this.activeSlot=s||null,this.options.deactivateHandlersWhenBlur&&this.activeBlocks.size>0&&this.activeBlocks.clear()),this.syncActiveElementStatus()},this.options=P({},xt,t),this.brand=String(this.options.brand),document.addEventListener("pointerup",this.handleGlobalPointerUp,!1);const e=this.hiddenInput=document.createElement("textarea");e.style.cssText="opacity:0;left:0;top:0;position:fixed;width:2px;height:2px",e.tabIndex=-1,e.inputMode="none",e.ownerDocument.body.appendChild(e);const u=o=>{var i;const s=this.options.serializeForClipboard(this.dumpSelectedData());s&&(o.preventDefault(),(i=o.clipboardData)==null||i.setData("text/plain",s))};e.addEventListener("copy",o=>{u(o)},!1),e.addEventListener("cut",o=>{u(o),this.deleteActiveBlocks()},!1),e.addEventListener("paste",o=>{o.preventDefault();try{var i;const s=(i=o.clipboardData)==null?void 0:i.getData("text/plain");if(!s)return;const l=this.options.unserializeForClipboard(s);this.pasteWithData(l)}catch(s){console.error("Failed to paste!",s)}},!1),e.addEventListener("focus",()=>{var o;this.hasFocus=!0,this.emit("focus",this),this.activeBlocks.forEach(i=>i.info.onStatusChange==null?void 0:i.info.onStatusChange(i)),(o=this.activeSlot)==null||o.info.onStatusChange==null||o.info.onStatusChange(this.activeSlot)},!1),e.addEventListener("blur",()=>{var o;this.hasFocus=!1,this._lastActiveElement=null,this.emit("blur",this),this.activeBlocks.forEach(i=>i.info.onStatusChange==null?void 0:i.info.onStatusChange(i)),(o=this.activeSlot)==null||o.info.onStatusChange==null||o.info.onStatusChange(this.activeSlot)},!1),e.addEventListener("keydown",o=>{const i=this.options;switch(o.code){case"KeyA":var s,l;i.multipleSelect&&(o.ctrlKey||o.metaKey)&&(this.activeBlocks=new Set(Array.from(((s=this.slotOfActiveBlocks)==null?void 0:s.items)||((l=this.activeSlot)==null?void 0:l.items)||[]).sort((r,c)=>r.index-c.index)),this.syncActiveElementStatus());break;case"ArrowUp":i.navigateWithArrowKeys&&this.activeNextBlock(-1,o.shiftKey||o.ctrlKey||o.metaKey);break;case"ArrowDown":i.navigateWithArrowKeys&&this.activeNextBlock(1,o.shiftKey||o.ctrlKey||o.metaKey);break;case"ArrowLeft":i.navigateWithArrowKeys&&this.activeParentBlock();break;case"ArrowRight":i.navigateWithArrowKeys&&this.activeChildrenBlocks();break;case"Delete":case"Backspace":i.handleDeleteKey&&this.deleteActiveBlocks();break;case"Tab":{const r=this._lastActiveElement;if(r&&"focus"in r){const c=r.tabIndex===-1&&r.querySelector("[tabIndex], button, textarea, input, select, a, [contentEditable]");c&&"focus"in c?c.focus():r.focus()}o.preventDefault()}}},!1)}focus(){document.activeElement!==this.hiddenInput&&(this._lastActiveElement=document.activeElement,this.hiddenInput.focus())}dumpSelectedData(){const t={isIBClipboardData:!0,ibContextBrand:this.brand,ibContextUUID:this.uuid,blocksData:[]};if(this.activeBlocks.forEach(e=>{t.blocksData.push(e.data)}),t.blocksData.length!==0)return t}copy(){this.hiddenInput.focus(),document.execCommand("copy")}pasteWithData(t,e){if(!rt(t,this.brand))throw new Error("Need a valid IBClipboardData object");const u=this.activeSlot;if(!u)return;const o=A(this.activeBlocks),i=e!=null?e:u===(o==null?void 0:o.ownerSlot)?o.index:Math.max(0,...Array.from(u.items.values(),l=>1+l.index)),s=new ct({type:"paste",ctx:this,data:t,slot:u,index:i});u.info.onPaste==null||u.info.onPaste(s),this.emit("paste",s),s.returnValue!==!1&&setTimeout(()=>{const l=t.blocksData.length+i-1,r=Array.from(u.items).filter(c=>c.index>=i&&c.index<=l);r.length&&(this.activeSlot=u,this.activeBlocks.clear(),r.forEach(c=>this.activeBlocks.add(c)),this.syncActiveElementStatus())},100)}deleteActiveBlocks(){var t;const e=Array.from(this.activeBlocks.values()),u=(t=e[0])==null?void 0:t.ownerSlot;if(!u)return!1;const o=e[0].index,i=new at({type:"cut",blocks:e,ctx:this,slot:u});if(u.info.onCut==null||u.info.onCut(i),this.emit("cut",i),i.returnValue){const s=R(u.items,l=>l.index===o);s&&this.addBlockToSelection(s)}return i.returnValue}activeNextBlock(t,e=!1){const u=e&&this.options.multipleSelect;this.focus();let o=!0,i=Array.from(this.activeBlocks);var s;if(!i.length&&(i=Array.from(((s=this.activeSlot)==null?void 0:s.items)||[]),o=!1,!i.length))return;const l=i[0].ownerSlot;let r=i[0].index,c=r,d=i[0],h=d;i.slice(1).forEach(v=>{if(v.ownerSlot!==l)return;const p=v.index;p>r&&(r=p,d=v),p<c&&(c=p,h=v)});const F=t>0?r+t:c+t,f=R(l==null?void 0:l.items,v=>v.index===F);f?(u||this.activeBlocks.clear(),this.activeBlocks.add(f),this.activeSlot=l,this.syncActiveElementStatus()):o?u||(this.activeBlocks.clear(),i.length>1&&this.activeBlocks.add(t>0?d:h),this.syncActiveElementStatus()):(this.activeBlocks.clear(),u?i.forEach(v=>this.activeBlocks.add(v)):this.activeBlocks.add(t>0?h:d),this.syncActiveElementStatus())}activeParentBlock(){var t;const e=(t=this.activeSlot)==null?void 0:t.ownerBlock;this.activeSlot=(e==null?void 0:e.ownerSlot)||null,this.activeBlocks.clear(),e&&this.activeBlocks.add(e),this.syncActiveElementStatus()}activeChildrenBlocks(){const t=A(this.activeBlocks),e=A(t==null?void 0:t.slots);if(e){if(this.activeSlot=e,this.activeBlocks.clear(),this.options.multipleSelect)e.items.forEach(u=>this.activeBlocks.add(u));else{const u=A(e.items);u&&this.activeBlocks.add(u)}this.syncActiveElementStatus()}}syncActiveElementStatus(){var t;let e=!1;const u=this.lastActiveBlocks,o=this.lastActiveSlot,i=Array.from(this.activeBlocks),s=((t=i[0])==null?void 0:t.ownerSlot)||null;var l;i.length>1&&s!==this.activeSlot&&(this.activeSlot=s),!this.activeSlot&&s&&(this.activeSlot=s),i.forEach((r,c)=>{u==null||u.delete(r),e=r._maybeUpdateActiveNumber(c)||e}),u==null||u.forEach(r=>{e=r._maybeUpdateActiveNumber(!1)||e}),this.activeSlot!==o&&(o==null||o._maybeUpdateActive(!1),(l=this.activeSlot)==null||l._maybeUpdateActive(!0),this.lastActiveSlot=this.activeSlot,e=!0),this.lastActiveBlocks=new Set(this.activeBlocks),this.slotOfActiveBlocks=s,e&&this.emit("activeElementChanged",this)}clearSelection(){this.activeBlocks.clear(),this.activeSlot=null,this.syncActiveElementStatus()}addBlockToSelection(t,e){var u;if(e=(u=e)?u===!0?"ctrl":typeof u=="object"?u.ctrlKey||u.metaKey?"ctrl":u.shiftKey?"shift":"none":u==="ctrl"?"ctrl":u==="shift"?"shift":"none":"none",this.options.multipleSelect||(e="none"),e==="none")this.activeBlocks.clear(),this.activeBlocks.add(t);else{const o=A(this.activeBlocks);if(o&&o.ownerSlot!==t.ownerSlot){const i=[];for(let l=o;l&&l.ownerSlot;)i.push(l.ownerSlot),l=l.ownerSlot.ownerBlock;let s=-1;for(let l=t;l&&l.ownerSlot;l=l.ownerSlot.ownerBlock)if((s=i.indexOf(l.ownerSlot))!==-1){t=l;break}s===-1?this.activeBlocks.clear():s>0&&(this.activeBlocks=new Set(Array.from(this.activeBlocks,l=>{for(let r=s;r>0;r--,l=l.ownerSlot.ownerBlock);return l})))}this.activeSlot=t.ownerSlot||null,this.activeSlot||(e="ctrl")}if(e==="ctrl"&&this.activeBlocks.add(t),e==="shift"){const o=this.activeSlot,i=t.index;let s=i,l=i;this.activeBlocks.forEach(r=>{const c=r.index;s>c&&(s=c),l<c&&(l=c)}),this.activeBlocks=new Set(Array.from(o.items).filter(r=>{const c=r.index;return c>=s&&c<=l}).sort((r,c)=>r.index-c.index))}this.syncActiveElementStatus()}dispose(){var t;this.dragging.dispose(),(t=this.hiddenInput.parentElement)==null||t.removeChild(this.hiddenInput),document.removeEventListener("pointerup",this.handleGlobalPointerUp,!1)}createBlock(t,e=null){return new ft(this,e,t)}createSlot(t,e=null){return new At(this,e,t)}}const Ct=()=>[{name:"\u{1F9E9} Click to Pick",children:[{name:"\u{1F36C} Alice"},{name:"\u{1F9F8} Bob"}]},{name:"Drag Card into slot \u{1F447}"},{name:"shortcut keys works too"}],Et=n=>{const t=[...n],e={};return{root:t,copiedBlocks:e,getSlotAndBlock(u){let o=t,i=null,s="";return u.forEach(l=>{if(s+=`/${l}`,!(s in e)){const r=o[l],c=L(S({},r),{children:[...r.children||[]]});o[l]=c,e[s]=c}i=e[s],o=i.children}),{slot:o,block:i}}}},yt=(n,t)=>{if("__demo_wholeReplace__"in t)return t.__demo_wholeReplace__;const e=Et(n),{slot:u,block:o}=e.getSlotAndBlock(t.path);if(t.rename&&o&&(o.name=t.rename.name),t.insert&&u.splice(t.insert.index,0,...t.insert.items),t.remove&&_(u,t.remove.indexes),t.moveInSlot){const{fromIndexes:i,toIndex:s}=t.moveInSlot;gt(u,i,s)}if(t.moveBetweenSlots){const{fromPath:i,fromIndexes:s,toIndex:l}=t.moveBetweenSlots,r=e.getSlotAndBlock(i).slot;mt(r,s,u,l)}return console.log("store reducer called",t,e),e.root},J=T(null),bt=n=>{const t=K(yt,null,Ct);return a(J.Provider,{value:t},n.children)},C=()=>I(J),X=T(null),Y=()=>I(X),wt=X.Provider,b=T(null);b.displayName="OwnerSlot";const Tt=()=>I(b),It=b.Provider;b.Consumer;const O=n=>{const t=y(n);t.current=n,H(()=>()=>t.current(),[])},G=()=>{const[,n]=K(t=>(t+1)%16777215,0);return n},Ht=n=>S({},n),Pt=n=>S({},n),m=n=>{const t=[];for(;n;)t.unshift(n.index),n=n.ownerSlot.ownerBlock;return t},w=(...n)=>n.filter(t=>!!t).map(t=>Array.isArray(t)?w(t):String(t)).join(" ");function _t(){const n=["\u{1F604}","\u{1F603}","\u{1F600}","\u{1F60A}","\u263A","\u{1F609}","\u{1F60D}","\u{1F618}","\u{1F61A}","\u{1F617}","\u{1F619}","\u{1F61C}","\u{1F61D}","\u{1F61B}","\u{1F633}","\u{1F601}","\u{1F614}","\u{1F60C}","\u{1F612}","\u{1F61E}","\u{1F623}","\u{1F622}","\u{1F602}","\u{1F62D}","\u{1F62A}","\u{1F625}","\u{1F630}","\u{1F605}","\u{1F613}","\u{1F629}","\u{1F62B}","\u{1F628}","\u{1F631}","\u{1F620}","\u{1F621}","\u{1F624}","\u{1F616}","\u{1F606}","\u{1F60B}","\u{1F637}","\u{1F60E}","\u{1F634}","\u{1F635}","\u{1F632}","\u{1F61F}","\u{1F626}","\u{1F627}","\u{1F608}","\u{1F47F}","\u{1F62E}","\u{1F62C}","\u{1F610}","\u{1F615}","\u{1F62F}","\u{1F636}","\u{1F607}","\u{1F60F}","\u{1F611}","\u{1F472}","\u{1F473}","\u{1F46E}","\u{1F477}","\u{1F482}","\u{1F476}","\u{1F466}","\u{1F467}","\u{1F468}","\u{1F469}","\u{1F474}","\u{1F475}","\u{1F471}","\u{1F47C}","\u{1F478}","\u{1F63A}","\u{1F638}","\u{1F63B}","\u{1F63D}","\u{1F63C}","\u{1F640}","\u{1F63F}","\u{1F639}","\u{1F63E}","\u{1F479}","\u{1F47A}","\u{1F648}","\u{1F649}","\u{1F64A}","\u{1F480}","\u{1F47D}","\u{1F4A9}","\u{1F525}","\u2728","\u{1F31F}","\u{1F4AB}","\u{1F4A5}","\u{1F4A2}","\u{1F4A6}","\u{1F4A7}","\u{1F4A4}","\u{1F4A8}","\u{1F442}","\u{1F440}","\u{1F443}","\u{1F445}","\u{1F444}","\u{1F44D}","\u{1F44E}","\u{1F44C}","\u{1F44A}","\u270A","\u270C","\u{1F44B}","\u270B","\u{1F450}","\u{1F446}","\u{1F447}","\u{1F449}","\u{1F448}","\u{1F64C}","\u{1F64F}","\u261D","\u{1F44F}","\u{1F4AA}","\u{1F6B6}","\u{1F3C3}","\u{1F483}","\u{1F46B}","\u{1F46A}","\u{1F46C}","\u{1F46D}","\u{1F48F}","\u{1F491}","\u{1F46F}","\u{1F646}","\u{1F645}","\u{1F481}","\u{1F64B}","\u{1F486}","\u{1F487}","\u{1F485}","\u{1F470}","\u{1F64E}","\u{1F64D}","\u{1F647}","\u{1F3A9}","\u{1F451}","\u{1F452}","\u{1F45F}","\u{1F45E}","\u{1F461}","\u{1F460}","\u{1F462}","\u{1F455}","\u{1F454}","\u{1F45A}","\u{1F457}","\u{1F3BD}","\u{1F456}","\u{1F458}","\u{1F459}","\u{1F4BC}","\u{1F45C}","\u{1F45D}","\u{1F45B}","\u{1F453}","\u{1F380}","\u{1F302}","\u{1F484}","\u{1F49B}","\u{1F499}","\u{1F49C}","\u{1F49A}","\u2764","\u{1F494}","\u{1F497}","\u{1F493}","\u{1F495}","\u{1F496}","\u{1F49E}","\u{1F498}","\u{1F48C}","\u{1F48B}","\u{1F48D}","\u{1F48E}","\u{1F464}","\u{1F465}","\u{1F4AC}","\u{1F463}","\u{1F4AD}","\u{1F436}","\u{1F43A}","\u{1F431}","\u{1F42D}","\u{1F439}","\u{1F430}","\u{1F438}","\u{1F42F}","\u{1F428}","\u{1F43B}","\u{1F437}","\u{1F43D}","\u{1F42E}","\u{1F417}","\u{1F435}","\u{1F412}","\u{1F434}","\u{1F411}","\u{1F418}","\u{1F43C}","\u{1F427}","\u{1F426}","\u{1F424}","\u{1F425}","\u{1F423}","\u{1F414}","\u{1F40D}","\u{1F422}","\u{1F41B}","\u{1F41D}","\u{1F41C}","\u{1F41E}","\u{1F40C}","\u{1F419}","\u{1F41A}","\u{1F420}","\u{1F41F}","\u{1F42C}","\u{1F433}","\u{1F40B}","\u{1F404}","\u{1F40F}","\u{1F400}","\u{1F403}","\u{1F405}","\u{1F407}","\u{1F409}","\u{1F40E}","\u{1F410}","\u{1F413}","\u{1F415}","\u{1F416}","\u{1F401}","\u{1F402}","\u{1F432}","\u{1F421}","\u{1F40A}","\u{1F42B}","\u{1F42A}","\u{1F406}","\u{1F408}","\u{1F429}","\u{1F43E}","\u{1F490}","\u{1F338}","\u{1F337}","\u{1F340}","\u{1F339}","\u{1F33B}","\u{1F33A}","\u{1F341}","\u{1F343}","\u{1F342}","\u{1F33F}","\u{1F33E}","\u{1F344}","\u{1F335}","\u{1F334}","\u{1F332}","\u{1F333}","\u{1F330}","\u{1F331}","\u{1F33C}","\u{1F310}","\u{1F31E}","\u{1F31D}","\u{1F31A}","\u{1F311}","\u{1F312}","\u{1F313}","\u{1F314}","\u{1F315}","\u{1F316}","\u{1F317}","\u{1F318}","\u{1F31C}","\u{1F31B}","\u{1F319}","\u{1F30D}","\u{1F30E}","\u{1F30F}","\u{1F30B}","\u{1F30C}","\u{1F320}","\u2B50","\u2600","\u26C5","\u2601","\u26A1","\u2614","\u2744","\u26C4","\u{1F300}","\u{1F301}","\u{1F308}","\u{1F30A}","\u{1F38D}","\u{1F49D}","\u{1F38E}","\u{1F392}","\u{1F393}","\u{1F38F}","\u{1F386}","\u{1F387}","\u{1F390}","\u{1F391}","\u{1F383}","\u{1F47B}","\u{1F385}","\u{1F384}","\u{1F381}","\u{1F38B}","\u{1F389}","\u{1F38A}","\u{1F388}","\u{1F38C}","\u{1F52E}","\u{1F3A5}","\u{1F4F7}","\u{1F4F9}","\u{1F4FC}","\u{1F4BF}","\u{1F4C0}","\u{1F4BD}","\u{1F4BE}","\u{1F4BB}","\u{1F4F1}","\u260E","\u{1F4DE}","\u{1F4DF}","\u{1F4E0}","\u{1F4E1}","\u{1F4FA}","\u{1F4FB}","\u{1F50A}","\u{1F509}","\u{1F508}","\u{1F507}","\u{1F514}","\u{1F515}","\u{1F4E2}","\u{1F4E3}","\u23F3","\u231B","\u23F0","\u231A","\u{1F513}","\u{1F512}","\u{1F50F}","\u{1F510}","\u{1F511}","\u{1F50E}","\u{1F4A1}","\u{1F526}","\u{1F506}","\u{1F505}","\u{1F50C}","\u{1F50B}","\u{1F50D}","\u{1F6C1}","\u{1F6C0}","\u{1F6BF}","\u{1F6BD}","\u{1F527}","\u{1F529}","\u{1F528}","\u{1F6AA}","\u{1F6AC}","\u{1F4A3}","\u{1F52B}","\u{1F52A}","\u{1F48A}","\u{1F489}","\u{1F4B0}","\u{1F4B4}","\u{1F4B5}","\u{1F4B7}","\u{1F4B6}","\u{1F4B3}","\u{1F4B8}","\u{1F4F2}","\u{1F4E7}","\u{1F4E5}","\u{1F4E4}","\u2709","\u{1F4E9}","\u{1F4E8}","\u{1F4EF}","\u{1F4EB}","\u{1F4EA}","\u{1F4EC}","\u{1F4ED}","\u{1F4EE}","\u{1F4E6}","\u{1F4DD}","\u{1F4C4}","\u{1F4C3}","\u{1F4D1}","\u{1F4CA}","\u{1F4C8}","\u{1F4C9}","\u{1F4DC}","\u{1F4CB}","\u{1F4C5}","\u{1F4C6}","\u{1F4C7}","\u{1F4C1}","\u{1F4C2}","\u2702","\u{1F4CC}","\u{1F4CE}","\u2712","\u270F","\u{1F4CF}","\u{1F4D0}","\u{1F4D5}","\u{1F4D7}","\u{1F4D8}","\u{1F4D9}","\u{1F4D3}","\u{1F4D4}","\u{1F4D2}","\u{1F4DA}","\u{1F4D6}","\u{1F516}","\u{1F4DB}","\u{1F52C}","\u{1F52D}","\u{1F4F0}","\u{1F3A8}","\u{1F3AC}","\u{1F3A4}","\u{1F3A7}","\u{1F3BC}","\u{1F3B5}","\u{1F3B6}","\u{1F3B9}","\u{1F3BB}","\u{1F3BA}","\u{1F3B7}","\u{1F3B8}","\u{1F47E}","\u{1F3AE}","\u{1F0CF}","\u{1F3B4}","\u{1F004}","\u{1F3B2}","\u{1F3AF}","\u{1F3C8}","\u{1F3C0}","\u26BD","\u26BE","\u{1F3BE}","\u{1F3B1}","\u{1F3C9}","\u{1F3B3}","\u26F3","\u{1F6B5}","\u{1F6B4}","\u{1F3C1}","\u{1F3C7}","\u{1F3C6}","\u{1F3BF}","\u{1F3C2}","\u{1F3CA}","\u{1F3C4}","\u{1F3A3}","\u2615","\u{1F375}","\u{1F376}","\u{1F37C}","\u{1F37A}","\u{1F37B}","\u{1F378}","\u{1F379}","\u{1F377}","\u{1F374}","\u{1F355}","\u{1F354}","\u{1F35F}","\u{1F357}","\u{1F356}","\u{1F35D}","\u{1F35B}","\u{1F364}","\u{1F371}","\u{1F363}","\u{1F365}","\u{1F359}","\u{1F358}","\u{1F35A}","\u{1F35C}","\u{1F372}","\u{1F362}","\u{1F361}","\u{1F373}","\u{1F35E}","\u{1F369}","\u{1F36E}","\u{1F366}","\u{1F368}","\u{1F367}","\u{1F382}","\u{1F370}","\u{1F36A}","\u{1F36B}","\u{1F36C}","\u{1F36D}","\u{1F36F}","\u{1F34E}","\u{1F34F}","\u{1F34A}","\u{1F34B}","\u{1F352}","\u{1F347}","\u{1F349}","\u{1F353}","\u{1F351}","\u{1F348}","\u{1F34C}","\u{1F350}","\u{1F34D}","\u{1F360}","\u{1F346}","\u{1F345}","\u{1F33D}","\u{1F3E0}","\u{1F3E1}","\u{1F3EB}","\u{1F3E2}","\u{1F3E3}","\u{1F3E5}","\u{1F3E6}","\u{1F3EA}","\u{1F3E9}","\u{1F3E8}","\u{1F492}","\u26EA","\u{1F3EC}","\u{1F3E4}","\u{1F307}","\u{1F306}","\u{1F3EF}","\u{1F3F0}","\u26FA","\u{1F3ED}","\u{1F5FC}","\u{1F5FE}","\u{1F5FB}","\u{1F304}","\u{1F305}","\u{1F303}","\u{1F5FD}","\u{1F309}","\u{1F3A0}","\u{1F3A1}","\u26F2","\u{1F3A2}","\u{1F6A2}","\u26F5","\u{1F6A4}","\u{1F6A3}","\u2693","\u{1F680}","\u2708","\u{1F4BA}","\u{1F681}","\u{1F682}","\u{1F68A}","\u{1F689}","\u{1F69E}","\u{1F686}","\u{1F684}","\u{1F685}","\u{1F688}","\u{1F687}","\u{1F69D}","\u{1F68B}","\u{1F683}","\u{1F68E}","\u{1F68C}","\u{1F68D}","\u{1F699}","\u{1F698}","\u{1F697}","\u{1F695}","\u{1F696}","\u{1F69B}","\u{1F69A}","\u{1F6A8}","\u{1F693}","\u{1F694}","\u{1F692}","\u{1F691}","\u{1F690}","\u{1F6B2}","\u{1F6A1}","\u{1F69F}","\u{1F6A0}","\u{1F69C}","\u{1F488}","\u{1F68F}","\u{1F3AB}","\u{1F6A6}","\u{1F6A5}","\u26A0","\u{1F6A7}","\u{1F530}","\u26FD","\u{1F3EE}","\u{1F3B0}","\u2668","\u{1F5FF}","\u{1F3AA}","\u{1F3AD}","\u{1F4CD}","\u{1F6A9}","\u2B06","\u2B07","\u2B05","\u27A1","\u{1F520}","\u{1F521}","\u{1F524}","\u2197","\u2196","\u2198","\u2199","\u2194","\u2195","\u{1F504}","\u25C0","\u25B6","\u{1F53C}","\u{1F53D}","\u21A9","\u21AA","\u2139","\u23EA","\u23E9","\u23EB","\u23EC","\u2935","\u2934","\u{1F197}","\u{1F500}","\u{1F501}","\u{1F502}","\u{1F195}","\u{1F199}","\u{1F192}","\u{1F193}","\u{1F196}","\u{1F4F6}","\u{1F3A6}","\u{1F201}","\u{1F22F}","\u{1F233}","\u{1F235}","\u{1F234}","\u{1F232}","\u{1F250}","\u{1F239}","\u{1F23A}","\u{1F236}","\u{1F21A}","\u{1F6BB}","\u{1F6B9}","\u{1F6BA}","\u{1F6BC}","\u{1F6BE}","\u{1F6B0}","\u{1F6AE}","\u{1F17F}","\u267F","\u{1F6AD}","\u{1F237}","\u{1F238}","\u{1F202}","\u24C2","\u{1F6C2}","\u{1F6C4}","\u{1F6C5}","\u{1F6C3}","\u{1F251}","\u3299","\u3297","\u{1F191}","\u{1F198}","\u{1F194}","\u{1F6AB}","\u{1F51E}","\u{1F4F5}","\u{1F6AF}","\u{1F6B1}","\u{1F6B3}","\u{1F6B7}","\u{1F6B8}","\u26D4","\u2733","\u2747","\u274E","\u2705","\u2734","\u{1F49F}","\u{1F19A}","\u{1F4F3}","\u{1F4F4}","\u{1F170}","\u{1F171}","\u{1F18E}","\u{1F17E}","\u{1F4A0}","\u27BF","\u267B","\u2648","\u2649","\u264A","\u264B","\u264C","\u264D","\u264E","\u264F","\u2650","\u2651","\u2652","\u2653","\u26CE","\u{1F52F}","\u{1F3E7}","\u{1F4B9}","\u{1F4B2}","\u{1F4B1}","\xA9","\xAE","\u2122","\u303D","\u3030","\u{1F51D}","\u{1F51A}","\u{1F519}","\u{1F51B}","\u{1F51C}","\u274C","\u2B55","\u2757","\u2753","\u2755","\u2754","\u{1F503}","\u{1F55B}","\u{1F567}","\u{1F550}","\u{1F55C}","\u{1F551}","\u{1F55D}","\u{1F552}","\u{1F55E}","\u{1F553}","\u{1F55F}","\u{1F554}","\u{1F560}","\u{1F555}","\u{1F556}","\u{1F557}","\u{1F558}","\u{1F559}","\u{1F55A}","\u{1F561}","\u{1F562}","\u{1F563}","\u{1F564}","\u{1F565}","\u{1F566}","\u2716","\u2795","\u2796","\u2797","\u2660","\u2665","\u2663","\u2666","\u{1F4AE}","\u{1F4AF}","\u2714","\u2611","\u{1F518}","\u{1F517}","\u27B0","\u{1F531}","\u{1F532}","\u{1F533}","\u25FC","\u25FB","\u25FE","\u25FD","\u25AA","\u25AB","\u{1F53A}","\u2B1C","\u2B1B","\u26AB","\u26AA","\u{1F534}","\u{1F535}","\u{1F53B}","\u{1F536}","\u{1F537}","\u{1F538}","\u{1F539}"];return n[Math.floor(Math.random()*n.length)]}const q=M(function(t){var h;const e=t.ownerBlock||null,[,u]=C(),o=G(),i=Y(),s=D(()=>i.createSlot({onCut:F=>u({path:m(e),remove:{indexes:F.blocks.map(f=>f.index)}}),onPaste:F=>u({path:m(e),insert:{index:F.index,items:F.data.blocksData.map(Ht)}}),onStatusChange:()=>o(),onDragHoverStatusChange:()=>o(),onMoveInSlot:F=>u({path:m(e),moveInSlot:{fromIndexes:F.blocks.map(f=>f.index),toIndex:F.index}}),onMoveToThisSlot:F=>{var f;return u({path:m(e),moveBetweenSlots:{fromPath:m((f=F.fromSlot)==null?void 0:f.ownerBlock),fromIndexes:F.blocks.map(v=>v.index),toIndex:F.index}})}},e),[]);O(()=>s.dispose());const l=g(F=>{s.handlePointerUp(),document.activeElement===F.currentTarget&&s.ctx.focus()},[]),r=D(()=>i.dragging.getDefaultSlotEventHandlers(s,"react"),[]),{isActive:c,isDragHovering:d}=s;return a("div",S({className:w("mySlot",c&&"isActive",d&&"isDragHovering"),tabIndex:-1,onPointerUp:l},r),a(It,{value:s},((h=t.children)==null?void 0:h.length)>0?t.children:a("div",{className:"mySlot-emptyPlaceholder"},"Empty")),s.isDragHovering&&a("div",{className:"mySlot-indexToDrop",key:"indexToDrop",style:{"grid-row-start":s.indexToDrop+1}},`indexToDrop = ${s.indexToDrop}`))}),Ot=M(function n(t){var p;const{index:e,item:u}=t,[,o]=C(),i=G(),s=y();ot(s,()=>({index:e,item:u}),[e,u]);const l=Y(),r=Tt(),c=D(()=>l.createBlock({data:()=>Pt(s.current.item),index:()=>s.current.index,onStatusChange:()=>i()},r),[]);O(()=>c.dispose());const d=g(x=>{c.handlePointerUp(),document.activeElement===x.currentTarget&&c.ctx.focus()},[]),h=D(()=>l.dragging.getDefaultBlockEventHandlers(c,"react"),[]),F=g(()=>{var U;const x=m(c),E={name:`${_t()} ${(~~(Math.random()*1e6+1e6)).toString(16).slice(-4).toUpperCase()}`};o({path:x,insert:{index:((U=u.children)==null?void 0:U.length)||0,items:[E]}})},[c]),{activeNumber:f,isActive:v}=c;return a("div",S({className:w("myBlock",v&&"isActive"),tabIndex:-1,onPointerUp:d,draggable:!0},h),v&&a("div",{className:"myBlock-selectIndex"},f+1),a(Ut,{name:u.name,blockHandler:c}),a(q,{ownerBlock:c},((p=u.children)==null?void 0:p.length)?u.children.map((x,E)=>a(n,{key:E,index:E,item:x})):null,a("button",{className:"myBlock-addButton",onClick:F},"Create...")))}),Ut=n=>{const[,t]=C(),e=g(u=>{const o=n.blockHandler,i=m(o),s=u.currentTarget.value;t({path:i,rename:{name:s}})},[]);return a("input",{className:"blockNameInput",type:"text",value:n.name,onChange:e})},Nt=()=>{const[n,t]=C(),e=y(null);H(()=>{e.current.value=JSON.stringify(n,null,2)},[n]);const u=y(null);u.current=n;const o=g((l=!0)=>{try{const r=JSON.parse(e.current.value);t({path:[],__demo_wholeReplace__:r})}catch(r){l&&(e.current.value=JSON.stringify(u.current,null,2)),console.error("Failed to replace: ",r)}},[]),i=g(()=>o(!0),[]),s=g(()=>o(!1),[]);return a("div",null,a("h3",null,"How to Play"),a("ol",null,a("li",null,"click to ",a("b",null,"pick block & slot")),a("li",null,a("b",null,"multiple-select")," with ",a("kbd",null,"Ctrl")," or ",a("kbd",null,"Shift")),a("li",null,a("b",null,"navigate")," with arrow keys"),a("li",null,a("b",null,"copy, cut, paste")," with ",a("kbd",null,"Ctrl+C")," / ",a("kbd",null,"Ctrl+X")," / ",a("kbd",null,"Ctrl+V")),a("li",null,"Drag and drop. Also supports cross-window dragging.")),a("h3",null,"Current Data"),a("textarea",{class:"demoPage-store",spellcheck:!1,ref:e,onBlur:i,onInput:s}))},$t=function(){const[n]=C(),[t,e]=it(!1),u=D(()=>new Dt,[]);return O(()=>u.dispose()),H(()=>{window.blockContext=u,u.on("focus",()=>e(!0)),u.on("blur",()=>e(!1)),u.on("paste",o=>{console.log("pasting...",o)})},[]),a(wt,{value:u},Mt,a("div",{className:w("demoPage",t&&"hasFocus")},a("div",{className:"demoPage-introductionArea"},a(Nt,null)),a("div",{className:"demoPage-blockArea"},a(q,null,n.map((o,i)=>a(Ot,{key:i,index:i,item:o}))))))},Lt="https://github.com/lyonbot/interactive-blocks",Kt="https://lyonbot.github.io/interactive-blocks/docs/",Mt=a(st,null,a("h2",null,"InteractiveBlocks"),a("p",null,"Just proving the abilities with shabby Slot and Block components here."),a("p",null,"Learn how to integrate with your own components? ",a("a",{href:Kt,target:"_blank"},"Read the Document \xBB")),a("a",{className:"demoPage-forkMe",href:Lt,target:"_blank"},"Fork me on GitHub"));nt(a(bt,null,a($t,null)),document.getElementById("app"));