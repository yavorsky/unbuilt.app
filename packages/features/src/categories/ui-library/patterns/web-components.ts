export const webComponents = [
  {
    name: 'define',
    score: 1,
    scripts: [
      /* Matches customElements.define() calls:
       - customElements.define("my-element", class extends HTMLElement {})
       - customElements.define("my-element",MyElement)
       - customElements.define( "my-element" , class { }) */
      /customElements\.define\s*\(\s*['"`][^'"`]+['"`]\s*,\s*(?:class\s+\w+\s+extends\s+HTMLElement|class\s*\{|function\s*\(|[A-Za-z_$][\w$]*)/,
    ],
  },
  {
    name: 'shadowDOMAttachment' as const,
    score: 1,
    scripts: [
      /* Matches Shadow DOM attachment
      - this.attachShadow({mode: "open"})
      - element.attachShadow({mode:"closed"})
      - this.attachShadow({mode: "open", delegatesFocus: true}) */
      /\.attachShadow\s*\(\s*\{(?:\s*mode\s*:\s*['"`](?:open|closed)['"`]|[^}]*)\}/,
    ],
  },
  {
    name: 'jsTemplateUsage' as const,
    score: 1,
    scripts: [
      /* Matches JavaScript template manipulation
      - document.querySelector("template")
      - template.content.cloneNode(true)
      - document.importNode(template.content, true) */
      /document\.querySelector\s*\(\s*['"`]template(?:[^'"`]*)?['"`]\)|\.content\.cloneNode\s*\(|\.importNode\s*\(\s*template/,
    ],
  },
  {
    name: 'lifecycleCallbacks' as const,
    score: 0.7,
    scripts: [
      /* Matches Web Component lifecycle callbacks
      - connectedCallback() {
      - disconnectedCallback(){
      - attributeChangedCallback(name, oldValue, newValue) {*/
      /(?:connected|disconnected|adopted)Callback|attributeChanged(?:Callback)?\s*\([^)]*\)\s*\{/,
    ],
  },
  {
    name: 'observedAttributes' as const,
    score: 0.6,
    scripts: [
      /* Matches observedAttributes static getter
      - static get observedAttributes() { return [
      - static get observedAttributes(){return[ */
      /(?:connected|disconnected|adopted)Callback|attributeChanged(?:Callback)?\s*\([^)]*\)\s*\{/,
    ],
  },
  {
    name: 'jsSlotInteraction' as const,
    score: 0.5,
    scripts: [
      /* Matches JavaScript slot interactions
      - element.slot = "header"
      - addEventListener("slotchange"
      - slot.assignedNodes()
      - slot.assignedElements() */
      /element\.slot\s*=|addEventListener\s*\(\s*['"`]slotchange['"`]|\.assignedNodes\s*\(|\.assignedElements\s*\(/,
    ],
  },
  {
    name: 'customElementUsage' as const,
    score: 0.7,
    documents: [
      /* Matches custom element tags
      <my-element>
      <user-card data-id="123">
      <fancy-button class="primary"> */
      /<[a-z]+-[a-z-]*[^>]*>/i,
    ],
  },
  {
    name: 'htmlTemplateUsage' as const,
    score: 0.7,
    documents: [
      /* Matches custom element tags
      <template id="my-template">content</template>
      <template><div>content</div></template> */
      /<template[^>]*>[\s\S]*?<\/template>/,
    ],
  },
  {
    name: 'htmlSlotUsage' as const,
    score: 0.7,
    documents: [
      /* Matches custom element tags
      <slot></slot>
      <slot name="header"></slot> */
      /<slot(?:[^>]*>[\s\S]*?<\/slot>)/,
    ],
  },
];
