﻿define([], function() {
    var Menu = function(app) {
        this.el = '.menu';
        this.$$ = app.$$;
        this.init = function() {
            this.setup();
        };

        this.setup = function() {
            this.countAbout = 0;
            this.countWork = 0;
            this.$el = this.$$(this.el);
            this.btnWork = this.$$('.btn-work');
            this.btnAbout = this.$$('.btn-about');
            this.workLine = this.$$('.btn-work > .line-ph > i');
            this.aboutLine = this.$$('.btn-about > .line-ph > i');

            this.addAnimationsListeners();
        };

        this.execute = function() {
            console.log('menu execute');
            this.hide();
            setTimeout(function(){
                this.animate();
                clearTimeout();
            }.bind(this),10);
        };
        this.animate = function() {
            console.log('menu animate');
            this.$$('.btn-work > .text-ph').addClass('animate-span');
            this.$$('.btn-work > .line-ph > i').addClass('animate-line');

            this.$$('.btn-about > .text-ph').addClass('animate-span-about');
            this.$$('.btn-about > .line-ph > i').addClass('animate-line-about');
        };

        this.addAnimationsListeners = function() {
            app.prefixedEventListener(this.workLine.elmts[0], 'AnimationEnd', function(e) {
                console.log('aaaa', this.countWork);
                this.countWork++;
                if (this.countWork === 2) {
                    this.$$(e.target).removeClass('animate-line');
                    this.$$(e.target).addClass('animate-line-fixed');
                    if (this.currentItem) {
                        this.deactivateButton();
                        this.activateButton(this.currentItem);
                    }
                }
            }.bind(this));
            app.prefixedEventListener(this.aboutLine.elmts[0], 'AnimationEnd', function(e) {
                this.countAbout++;
                if (this.countAbout === 2) {
                    this.$$(e.target).removeClass('animate-line-about');
                    this.$$(e.target).addClass('animate-line-fixed');
                    if (this.currentItem) {
                        this.deactivateButton();
                        this.activateButton(this.currentItem);
                    }
                }
            }.bind(this));
        };

        this.hide = function() {
            this.countAbout = 0;
            this.countWork = 0;
            this.$$('.btn-work > .text-ph').removeClass('animate-span');
            this.$$('.btn-work > .line-ph > i').removeClass('animate-line');

            this.$$('.btn-about > .text-ph').removeClass('animate-span-about');
            this.$$('.btn-about > .line-ph > i').removeClass('animate-line-about');

            this.btnWork.removeClass('active-button');
            this.btnAbout.removeClass('active-button');

            this.$$('.btn-work > .line-ph > i').removeClass('animate-line-fixed');
            this.$$('.btn-about').find('.line-ph').find('i').removeClass('animate-line-fixed');

            console.log('menu hide');
        };

        this.activateMenu = function(view) {
            this.currentItem = view;
            console.log('activateMenu', view, this);
            if (this.countAbout > 1 && this.countWork > 1) {
                this.deactivateButton();
                this.activateButton(view);
            }
        };

        this.deactivateButton = function() {
            this.btnWork.removeClass('active-button');
            this.btnAbout.removeClass('active-button');
        };

        this.activateButton = function(view) {
            try {
                this.$$('.btn-' + view).addClass('active-button');
            } catch (e) {};
        };
    };
    return Menu;
});
