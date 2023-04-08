/**
 * @property {AudioNode} inputNode
 * @property {AudioNode} outputNode
 * 
 * @property {ChannelSplitterNode} splitter - the module inputNode
 * @property {ChannelMergerNode} merger - the module outputNode
 * 
 * @property {Array} modules - list of internals modules
 * 
 * @method addModule(module, thru=false) 
 * @method bypassModule(module)
 * @method thruModule(module)
 */

class BasicMerger {
    inputNode;
    outputNode;
    modules = [];

    constructor(context) {
        this.splitter = new ChannelSplitterNode(context);
        this.merger = new ChannelMergerNode(context);

        this.inputNode = this.splitter;
        this.outputNode = this.merger;

        this.inputNode.connect(this.outputNode);
    }


    /**
     * Add a module on object modules list, connect the splitter to it, but not connect the node to an output, and set this isGoToOut state to false
     * @param {} module - the module to append 
     */
    addModule(module, thru = false) {
        this.modules.push(module);

        // try to connect splitter to the new module if have an input
        try {
            this.inputNode.connect(module.inputNode);

        } catch (error) {}

        if(thru === true) {
            this.thruModule(module);
        }
        else {
            module.isGoToOut = false;
        }
    }


    /**
     * Bypass a module from the modules list.  
     * - Disconnect the module output from merger
     * - If no modules is connected, reconnect the inputNode to outputNode
     * 
     * @param {} module - the module to bypass
     */
    bypassModule(module) {
        module.outputNode.disconnect();
        module.isGoToOut = false;

        // if at least one node from the nodes list is connected, the splitter is bypassed
        let oneModuleConnected = false;

        this.modules.forEach(m => {
            if(m.isGoToOut === true) {
                oneModuleConnected = true;
            }
        })

        if(!oneModuleConnected) {
            this.inputNode.connect(this.outputNode);
        }
    }


    /**
     * Remove the bypass from the module, and disconnect the inputNode from the ouputNode
     * @param {} module 
     */
    thruModule(module) {
        module.outputNode.connect(this.outputNode);
        module.isGoToOut = true;

        try {
            this.inputNode.disconnect(this.outputNode);

        } catch (error) {}
    }

    static mergerBypassHandler(input, module, merger) {
        if(input.value === 'on') {
            merger.bypassModule(module);
        }
        else {
            merger.thruModule(module);
        }
        input.value = input.value === 'on' ? 'off' : 'on';
        input.dataset.state = input.value;
    }

}