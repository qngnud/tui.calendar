/**
 * @fileoverview View of allday event container inside of Week view.
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.ne.util;
var domutil = require('../../common/domutil');
var View = require('../view');
var MonthWeek = require('../monthweek');
var mainTmpl = require('../template/week/allday.hbs');

/**
 * @constructor
 * @extends {View}
 * @param {object} options The object for view customization.
 * @param {string} options.renderStartDate - start date of allday view's render date. YYYY-MM-DD
 * @param {string} options.renderEndDate - end date of allday view's render date. YYYY-MM-DD
 * @param {number} [options.height=60] - minimum height of event container element.
 * @param {number} [options.eventBlockHeight=18] - height of each event block.
 * @param {number} [options.eventBlockGutter=2] - gutter height of each event block.
 * @param {HTMLElement} container Container element.
 */
function Allday(options, container) {
    container = domutil.appendHTMLElement(
        'div',
        container,
        'schedule-view-allday-container'
    );

    /**
     * rendering options.
     * @type {object}
     */
    this.options = util.extend({
        title: '종일일정',
        renderStartDate: '',
        renderEndDate: '',
        containerHeight: 40,
        containerBottomGutter: 8,
        eventHeight: 18,
        eventGutter: 2
    }, options);

    View.call(this, null, container);
}

util.inherit(Allday, View);

/**
 * create month week view model for render allday events in top of week views.
 * @override
 * @param {object} viewModel - viewModel from parent views.
 */
Allday.prototype.render = function(viewModel) {
    var container = this.container,
        monthWeekInst;

    container.innerHTML = mainTmpl(this.options);

    this.childs.clear();

    monthWeekInst = new MonthWeek(
        this.options, 
        domutil.find('.schedule-view-allday-monthweek-container', container)
    );

    this.addChild(monthWeekInst);

    this.childs.each(function(childView) {
        childView.render(viewModel);
    });
};

module.exports = Allday;

