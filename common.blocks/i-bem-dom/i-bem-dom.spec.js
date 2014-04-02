modules.define(
    'spec',
    ['i-bem', 'i-bem-dom', 'objects', 'jquery', 'sinon', 'BEMHTML'],
    function(provide, BEM, BEMDOM, objects, $, sinon, BEMHTML) {

describe('i-bem-dom', function() {
    describe('getMod', function() {
        it('should return properly extracted mod from html', function() {
            BEMDOM.declBlock('block', {});

            var rootNode;
            [
                {
                    cls : '',
                    val : ''
                },
                {
                    cls : 'block_m1_v1',
                    val : 'v1'
                },
                {
                    cls : 'block_m1_v1 bla-block_m1_v2',
                    val : 'v1'
                },
                {
                    cls : 'bla-block_m1_v2 block_m1_v1',
                    val : 'v1'
                },
                {
                    cls : 'block_m1',
                    val : true
                }
            ].forEach(function(data) {
                (rootNode = $('<div class="' + data.cls + '"/>')).bem('block').getMod('m1')
                    .should.be.eql(data.val);
                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });
    });

    describe('getMods', function() {
        it('should return properly extracted block mods from html', function() {
            BEMDOM.declBlock('block', {});

            var rootNode;
            [
                {
                    cls : '',
                    mods : { js : 'inited' }
                },
                {
                    cls : 'block_m1_v1',
                    mods : { js : 'inited', m1 : 'v1' }
                },
                {
                    cls : 'block_m1_v1 block_m2_v2 bla-block_m4_v3 block_m4_v4',
                    mods : { js : 'inited', m1 : 'v1', m2 : 'v2', m4 : 'v4' }
                },
                {
                    cls : 'bla-block_m1_v1 block_m2_v2 block_m3_v3 bla-block_m3_v4 block_m4',
                    mods : { js : 'inited', m2 : 'v2', m3 : 'v3', m4 : true }
                }
            ].forEach(function(data) {
                (rootNode = $('<div class="' + data.cls + '"/>')).bem('block').getMods()
                    .should.be.eql(data.mods);
                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });

        it('should return properly extracted elem mods from html', function() {
            BEMDOM.declBlock('block', {});

            var rootNode;
            [
                {
                    cls : 'block__e1_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    cls : 'block__e1_m1_v1 block__e1_m2_v2 bla-block__e1_m4_v3 block__e1_m4_v4',
                    mods : { m1 : 'v1', m2 : 'v2', m4 : 'v4' }
                },
                {
                    cls : 'bla-block__e1_m1_v1 block__e1_m2_v2 block__e1_m3_v3 bla-block__e1_m3_v4 block__e1_m4',
                    mods : { m2 : 'v2', m3 : 'v3', m4 : true }
                }
            ].forEach(function(data) {
                var block = (rootNode = $('<div class="block block__e1 ' + data.cls + '"/>')).bem('block');
                block.getMods(block.elem('e1')).should.be.eql(data.mods);
                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });
    });

    describe('setMod', function() {
        it('should properly set CSS classes', function() {
            BEMDOM.declBlock('block', {});

            var rootNode;
            [
                {
                    beforeCls : 'block i-bem',
                    afterCls : 'block i-bem block_js_inited block_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    beforeCls : 'block i-bem block_m6 block_m7_v7',
                    afterCls : 'block i-bem block_js_inited block_m1_v1 block_m2_v2 block_m3 block_m4_v4 block_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' }
                }
            ].forEach(function(data) {
                var block = (rootNode = $('<div class="' + data.beforeCls + '"/>')).bem('block');

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(modName) :
                        block.setMod(modName, modVal);
                });

                block.domElem[0].className.should.be.equal(data.afterCls);

                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });

        it('should properly set elem CSS classes', function() {
            BEMDOM.declBlock('block', {});

            var rootNode;
            [
                {
                    beforeCls : 'block__elem',
                    afterCls : 'block__elem block__elem_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    beforeCls : 'block__elem block__elem_m6 block__elem_m7_v7',
                    afterCls : 'block__elem block__elem_m1_v1 block__elem_m2_v2 block__elem_m3 block__elem_m4_v4 block__elem_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' }
                }
            ].forEach(function(data) {
                var block = (rootNode = $('<div class="block"><div class="' + data.beforeCls + '"/></div>')).bem('block'),
                    elem = block.elem('elem');

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(elem, modName) :
                        block.setMod(elem, modName, modVal);
                });

                elem[0].className.should.be.equal(data.afterCls);

                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });
    });

    describe('elemify', function() {
        var rootNode, instance;
        beforeEach(function() {
            BEMDOM.declBlock('block', {});
            rootNode = BEMDOM.init($(BEMHTML.apply({
                block : 'block',
                js : true,
                content : { elem : 'e1', mix : { elem : 'e2' } } })));
            instance = rootNode.bem('block');
        });
        afterEach(function() {
            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
        });

        it('shouldn\'t change given elem', function() {
            var elem1 = instance.elem('e1');
            instance.elemify(elem1, 'e2');
            instance.__self._extractElemNameFrom(elem1).should.be.equal('e1');
        });

        it('should return', function() {
            var elem = instance.elemify(instance.elem('e1'), 'e2');
            instance.__self._extractElemNameFrom(elem).should.be.equal('e2');
        });
    });

    describe('findBlocksInside', function() {
        function getBlockIds(blocks) {
            return blocks.map(function(block) {
                return block.params.id;
            });
        }

        var rootNode, rootBlock;
        beforeEach(function() {
            rootNode = $(BEMHTML.apply(
                {
                    block : 'root',
                    content : {
                        block : 'b1',
                        js : { id : '1' },
                        content : [
                            { block : 'b2' },
                            {
                                block : 'b1',
                                mods : { m1 : 'v1' },
                                js : { id : '2' }
                            },
                            {
                                block : 'b3',
                                content : {
                                    block : 'b1',
                                    mods : { m1 : 'v2' },
                                    js : { id : '3' },
                                    content : {
                                        block : 'b1',
                                        mods : { m1 : true },
                                        js : { id : '4' }
                                    }
                                }
                            }
                        ]
                    }
                }));
            rootBlock = BEMDOM.init(rootNode).bem('root');
        });

        afterEach(function() {
            BEMDOM.destruct(rootNode);
            delete BEM.blocks['b-root'];
            delete BEM.blocks['b1'];
        });

        it('should find all blocks by name', function() {
            getBlockIds(rootBlock.findBlocksInside('b1')).should.be.eql(['1', '2', '3', '4']);
        });

        it('should find all blocks by name, modName and modVal', function() {
            getBlockIds(rootBlock.findBlocksInside({ block : 'b1', modName : 'm1', modVal : 'v1' }))
                .should.be.eql(['2']);
        });

        it('should find all blocks by name and boolean mod', function() {
            getBlockIds(rootBlock.findBlocksInside({ block : 'b1', modName : 'm1', modVal : true }))
                .should.be.eql(['4']);
        });
    });

    describe('BEMDOM.init', function() {
        var spy, rootNode;
        beforeEach(function() {
            spy = sinon.spy();
        });

        afterEach(function() {
            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
        });

        it('should init block', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            rootNode = BEMDOM.init($(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block', js : true } })));

            spy.should.have.been.called;
        });

        it('shouldn\'t init live block', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            }, {
                live : true
            });

            rootNode = BEMDOM.init($(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block', js : true } })));

            BEMDOM.init(rootNode);
            spy.should.not.have.been.called;
        });

        it('should allow to pass string', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block', js : true } }));

            spy.should.have.been.called;
        });
    });

    describe('BEMDOM.destruct', function() {
        var spy, rootNode;
        beforeEach(function() {
            spy = sinon.spy();
        });

        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should destruct block only if it has no dom nodes', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            rootNode = BEMDOM.init($(BEMHTML.apply({
                tag : 'div',
                content : [
                    { block : 'block', js : { id : 'block' } },
                    { block : 'block', js : { id : 'block' } }
                ]
            })));

            BEMDOM.destruct(rootNode.find('.block :eq(0)'));
            spy.should.not.have.been.called;

            BEMDOM.destruct(rootNode.find('.block'));
            spy.should.have.been.called;

            BEMDOM.destruct(rootNode);
        });

        it('should destruct implicitly inited block', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block' }
            }));

            var blockNode = rootNode.find('.block');
            blockNode.bem('block');
            BEMDOM.destruct(blockNode);
            spy.should.have.been.called;
        });
    });

    describe('BEMDOM.update', function() {
        it('should update tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            BEM.declBlock('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            BEM.declBlock('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            var rootNode = BEMDOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block1', js : true } })));

            BEMDOM.update(rootNode, BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.called.should.be.true;
            spyBlock2Inited.called.should.be.true;

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block1'];
            delete BEM.blocks['block2'];
        });

        it('should allow to pass simple string', function() {
            var domElem = $('<div/>');
            BEMDOM.update(domElem, 'simple string');
            domElem.html().should.be.equal('simple string');
        });
    });

    describe('DOM.replace', function() {
        it('should properly replace tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            BEM.declBlock('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            BEM.declBlock('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            var rootNode = BEMDOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block1', js : true } })));

            BEMDOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledOnce;
            spyBlock2Inited.should.have.been.calledOnce;

            rootNode.html().should.be.equal('<div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div>');

            BEMDOM.destruct(rootNode);

            rootNode = BEMDOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : [{ tag : 'p' }, { block : 'block1', js : true }, { tag : 'p' }] })));

            BEMDOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledTwice;
            spyBlock2Inited.should.have.been.calledTwice;

            rootNode.html().should.be.equal('<p></p><div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div><p></p>');

            delete BEM.blocks['block1'];
            delete BEM.blocks['block2'];
        });
    });

    describe('params', function() {
        it('should properly join params', function() {
            BEM.declBlock('block', {
                getDefaultParams : function() {
                    return { p1 : 1 };
                }
            });

            BEM.declBlock('block2', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            var params = this.findBlockOn('block').params;
                            params.p1.should.be.equal(1);
                            params.p2.should.be.equal(2);
                            params.p3.should.be.equal(3);
                        }
                    }
                }
            });

            var rootNode = BEMDOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : [
                        { block : 'block', js : { id : 'bla', p2 : 2 }, mix : { block : 'block2', js : true } },
                        { block : 'block', js : { id : 'bla', p3 : 3 } }
                    ]
                })));

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
            delete BEM.blocks['block2'];
        });
    });

    describe('emit', function() {
        it('should emit context event with target', function() {
            BEM.declBlock('block', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            this.emit('event');
                        }
                    }
                }
            });

            var rootNode = $('<div/>'),
                spy = sinon.spy();

            BEM.blocks['block'].on(rootNode, 'event', spy);
            BEMDOM.update(rootNode, BEMHTML.apply({ block : 'block', js : true }));

            var block = rootNode.find('.block').bem('block');

            spy.should.have.been.calledOnce;
            spy.args[0][0].target.should.be.equal(block);

            delete BEM.blocks['block'];
        });
    });

    describe('containsDomElem', function() {
        var domElem, block, block2;
        beforeEach(function() {
            BEM.declBlock('block');
            BEM.declBlock('block2');

            domElem = $(BEMHTML.apply([
                {
                    block : 'block',
                    js : { id : '1' },
                    content : [
                        { elem : 'e1' },
                        { elem : 'e2' }
                    ]
                },
                {
                    block : 'block',
                    js : { id : '1' },
                    content : [
                        { elem : 'e1' },
                        { elem : 'e2', content : { elem : 'e2-1' } }
                    ]
                },
                {
                    block : 'block2'
                }
            ]));

            BEMDOM.init(domElem);
            block = domElem.filter('.block').bem('block');
            block2 = domElem.filter('.block2').bem('block2');
        });

        afterEach(function() {
            BEMDOM.destruct(domElem);
            delete BEM.blocks['block'];
            delete BEM.blocks['block2'];
        });

        it('should properly checks for nested dom elem', function() {
            block.containsDomElem(block.elem('e2-1')).should.be.true;
            block.containsDomElem(block2.domElem).should.be.false;
        });

        it('should properly checks for nested dom elem with given context', function() {
            block.containsDomElem(block.elem('e1'), block.elem('e2-1')).should.be.false;
            block.containsDomElem(block.elem('e2'), block.elem('e2-1')).should.be.true;
        });
    });

    describe('DOM events', function() {
        var block, spy1, spy2, spy3, spy4, spy5, spy6, spy7,
            win = $(window);

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            spy3 = sinon.spy();
            spy4 = sinon.spy();
            spy5 = sinon.spy();
            spy6 = sinon.spy();
            spy7 = sinon.spy();

            BEM.declBlock('block', {
                 bindToClick : function() {
                    this
                        .bindTo('click', this._handler1)
                        .bindTo('click', this._handler2)
                        .bindTo('elem', 'click', this._handler3)
                        .bindTo(this.elem('elem'), 'click', this._handler4)
                        .bindTo(this.elem('elem2'), 'click', this._handler5)
                        .bindToWin('resize', this._handler6)
                        .bindToWin('resize', this._handler7);
                },

                _handler1 : spy1,
                _handler2 : spy2,
                _handler3 : spy3,
                _handler4 : spy4,
                _handler5 : spy5,
                _handler6 : spy6,
                _handler7 : spy7,

                unbindAllFromDomElem : function() {
                    this.unbindFrom('click');
                },

                unbindHandler1FromDomElem : function() {
                    this.unbindFrom('click', this._handler1);
                },

                unbindAllFromElemByString : function() {
                    this.unbindFrom('elem', 'click');
                },

                unbindAllFromElemByElem : function() {
                    this.unbindFrom(this.elem('elem'), 'click');
                },

                unbindHandler3FromElemByString : function() {
                    this.unbindFrom('elem', 'click', this._handler3);
                },

                unbindClick4FromElemByElem : function() {
                    this.unbindFrom(this.elem('elem'), 'click', this._handler4);
                },

                unbindHandler6FromWin : function() {
                    this.unbindFromWin('resize', this._handler6);
                }
            });

            block = BEMDOM.init($(BEMHTML.apply({ block : 'block', content : { elem : 'elem' } }))).bem('block');
            block.bindToClick();
        });

        afterEach(function() {
            BEMDOM.destruct(block.domElem);
            delete BEM.blocks['block'];
        });

        it('should properly bind to block-self DOM elem', function() {
            block.domElem.click();
            spy1.should.have.been.calledOnce;
            spy2.should.have.been.calledOnce;
            spy3.should.not.have.been.called;
            spy4.should.not.have.been.called;
            spy5.should.not.have.been.called;
        });

        it('should properly unbind to block-self DOM elem', function() {
            block.unbindAllFromDomElem();
            block.domElem.click();
            spy1.should.not.have.been.called;
            spy2.should.not.have.been.called;
        });

        it('should unbind from block-self DOM elem specified function only', function() {
            block.unbindHandler1FromDomElem();
            block.domElem.click();
            spy1.should.not.have.been.called;
            spy2.should.have.been.calledOnce;
        });

        it('should properly bind to block elem', function() {
            block.elem('elem').click();
            spy3.should.have.been.calledOnce;
            spy4.should.have.been.calledOnce;
            spy5.should.not.have.been.called;
        });

        it('should properly unbind from block elem by string', function() {
            block.unbindAllFromElemByString();
            block.elem('elem').click();
            spy3.should.not.have.been.called;
            spy4.should.not.have.been.called;
        });

        it('should properly unbind from block elem by elem', function() {
            block.unbindAllFromElemByElem();
            block.elem('elem').click();
            spy3.should.not.have.been.called;
            spy4.should.not.have.been.called;
        });

        it('should properly unbind specified function from block elem by elem', function() {
            block.unbindHandler3FromElemByString();
            block.elem('elem').click();
            spy3.should.not.have.been.called;
            spy4.should.have.been.calledOnce;
        });

        it('should properly unbind specified function from block elem by string', function() {
            block.unbindClick4FromElemByElem();
            block.elem('elem').click();
            spy3.should.have.been.calledOnce;
            spy4.should.not.have.been.called;
        });

        it('should properly bind to window event', function() {
            win.trigger('resize');
            spy6.should.have.been.calledOnce;
            spy7.should.have.been.calledOnce;
        });

        it('should properly unbind from window event', function() {
            block.unbindFromWin('resize');
            win.trigger('resize');
            spy6.should.not.have.been.called;
            spy7.should.not.have.been.called;
        });

        it('should properly unbind specified function from window event', function() {
            block.unbindHandler6FromWin();
            win.trigger('resize');
            spy6.should.not.have.been.called;
            spy7.should.have.been.calledOnce;
        });
    });

    describe('closestElem', function() {
        it('should return the closest element', function() {
            BEM.declBlock('block', {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem1',
                        content : {
                            elem : 'elem2'
                        }
                    }
                })),
                block = rootNode.bem('block'),
                closest = block.closestElem(block.elem('elem2'), 'elem1');

            closest[0].should.be.equal(block.elem('elem1')[0]);

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
        });
    });

    describe('liveInitOnBlockInsideEvent', function() {
        it('should init and call handler on live initialization', function() {
            var spyInit = sinon.spy(),
                spyHandler = sinon.spy();

            BEM.declBlock('block1', {
                onSetMod : {
                    js : {
                        inited : spyInit
                    }
                }
            }, {
                live : function() {
                    this.liveInitOnBlockInsideEvent('event', 'block2', spyHandler);
                }
            });
            BEM.declBlock('block2', {}, {});

            var rootNode = BEMDOM.init($(BEMHTML.apply({
                    block : 'block1',
                    js : true,
                    content : {
                        block : 'block2',
                        js : true
                    }
                }))),
                block = rootNode.find('.block2').bem('block2');

            spyInit.called.should.be.false;
            spyHandler.called.should.be.false;

            block.emit('event');

            spyInit.called.should.be.true;
            spyHandler.called.should.be.true;

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block1'];
            delete BEM.blocks['block2'];
        });
    });

    describe('modules.define patching', function() {
        it('should provide BEMDOM block', function(done) {
            var name = 'b' + Math.random(),
                spy = sinon.spy();

            modules.define(name, ['i-bem__dom'], function(provide, BEMDOM) {
                spy();
                provide(BEM.declBlock(this.name, {}));
            });

            modules.define(name, function(provide, Prev) {
                spy();
                Prev.should.be.eql(BEM.blocks[this.name]);
                provide(Prev.decl(this.name, {}));
            });

            modules.require([name], function(Block) {
                spy.should.have.been.calledTwice;
                Block.should.be.eql(BEM.blocks[name]);
                done();
            });
        });
    });

    describe('mod change events', function() {
        var block;
        beforeEach(function() {
            block = $(BEMHTML.apply(
                {
                    block : 'block',
                    content : [
                        { elem : 'e1', mods : { 'mod1' : 'val1' } },
                        { elem : 'e1', mods : { 'mod1' : 'val1' } },
                        { elem : 'e2', mods : { 'mod1' : 'val1' } }
                    ]
                }))
                .bem('block');
        });

        afterEach(function() {
            delete BEM.blocks['block'];
        });

        describe('elems', function() {
            it('should emit event on elem mod change with correct arguments', function() {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy(),
                    spy3 = sinon.spy(),
                    spy4 = sinon.spy(),
                    elem = block.elem('e1');

                block
                    .on({ elem : 'e1', modName : 'mod1', modVal : '*' }, spy1)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val2' }, spy2)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val3' }, spy3)
                    .on({ elem : 'e2', modName : 'mod1', modVal : 'val2' }, spy4)
                    .setMod(elem, 'mod1', 'val2');

                spy1.should.have.been.called.twice;
                spy2.should.have.been.called.twice;
                spy3.should.not.have.been.called;
                spy4.should.not.have.been.called;

                var eventData = spy1.args[0][1];
                eventData.modName.should.be.equal('mod1');
                eventData.modVal.should.be.equal('val2');
                eventData.oldModVal.should.be.equal('val1');
                eventData.elem[0].should.be.eql(elem[0]);
                spy1.args[1][1].elem[0].should.be.eql(elem[1]);
            });

            it('should emit live event on elem mod change with correct arguments', function() {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy(),
                    spy3 = sinon.spy(),
                    spy4 = sinon.spy(),
                    elem = block.elem('e1');

                BEM.blocks['block']
                    .on({ elem : 'e1', modName : 'mod1', modVal : '*' }, spy1)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val2' }, spy2)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val3' }, spy3)
                    .on({ elem : 'e2', modName : 'mod1', modVal : 'val2' }, spy4);

                block.setMod(elem, 'mod1', 'val2');

                spy1.should.have.been.called.twice;
                spy2.should.have.been.called.twice;
                spy3.should.not.have.been.called;
                spy4.should.not.have.been.called;

                var eventData = spy1.args[0][1];
                eventData.modName.should.be.equal('mod1');
                eventData.modVal.should.be.equal('val2');
                eventData.oldModVal.should.be.equal('val1');
                eventData.elem[0].should.be.eql(elem[0]);
                spy1.args[1][1].elem[0].should.be.eql(elem[1]);
            });
        });
    });
});

provide();

});
