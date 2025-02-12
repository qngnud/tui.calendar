/* eslint complexity: 0 */
/**
 * @fileoverview Helpers for handlebar templates.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
'use strict';

var util = require('tui-code-snippet');
var Handlebars = require('handlebars-template-loader/runtime');
var datetime = require('../../common/datetime');
var common = require('../../common/common');
var config = require('../../config');
var mmax = Math.max;
var SIXTY_MINUTES = 60;
var helpers = {
    /**
     * Stamp supplied object
     *
     * Commonly use for rendering object's unique ID to rendered view
     * @param {object} obj - object to stamp
     * @returns {number} stamp value
     */
    stamp: function (obj) {
        return util.stamp(obj);
    },

    /**
     * Whether supplied object are equal?
     * @param {*} a - a
     * @param {*} b - b
     * @returns {boolean} result of operation
     */
    equal: function (a, b) {
        return a === b;
    },

    /**
     * OR
     * @param {*} a - a
     * @param {*} b - b
     * @returns {boolean} or
     */
    or: function (a, b) {
        return a || b;
    },

    /**
     * AND
     * @param {*} a - a
     * @param {*} b - b
     * @returns {boolean} or
     */
    and: function (a, b) {
        return a && b;
    },

    /**
     * Compare object or apply logical operation by customizable oper parameter
     * @param {*} a - a
     * @param {string} oper - operator ex) '==', '<'
     * @param {*} b - b
     * @param {Handlebars} options - handlebar options
     * @returns {boolean} result of operation
     */
    fi: function (a, oper, b, options) {
        switch (oper) {
            case '==':
                return a == b ? options.fn(this) : options.inverse(this); // eslint-disable-line
            case '===':
                return a === b ? options.fn(this) : options.inverse(this);
            case '!==':
                return a !== b ? options.fn(this) : options.inverse(this);
            case '<':
                return a < b ? options.fn(this) : options.inverse(this);
            case '||':
                return a || b ? options.fn(this) : options.inverse(this);
            default:
                throw new Error('Not match operation');
        }
    },

    /**
     * Get hhmm formatted time str
     * @param {Date} date - date object
     * @returns {string} formatted value
     */
    hhmm: function (date) {
        return datetime.format(date, 'HH:mm');
    },

    /**
     * Get `width` stylesheet string
     * @param {number} width - width percentage
     * @returns {string} css style part
     */
    'common-width': function (width) {
        return getElSize(width, '%', 'width');
    },

    /**
     * Get element left based on narrowWeekend
     * @param {object} viewModel - view model
     * @param {Array} grids - dates information
     * @returns {number} element left
     */
    'grid-left': function (viewModel, grids) {
        return getElLeft(viewModel, grids);
    },

    /**
     * Get element width based on narrowWeekend
     * @param {object} viewModel - view model
     * @param {Array} grids - dates information
     * @returns {number} element width
     */
    'grid-width': function (viewModel, grids) {
        return getElWidth(viewModel, grids);
    },

    /**
     * Use in time.hbs
     * @param {ScheduleViewModel} viewModel viewModel
     * @returns {string} element size css class
     */
    'time-scheduleBlock': function (viewModel) {
        var top = getElSize(viewModel.top, 'px', 'top'),
            left = getElSize(viewModel.left, '%', 'left'),
            width = getElSize(viewModel.width, '%', 'width'),
            height = getElSize(viewModel.height, 'px', 'height');

        return [top, left, width, height].join(';');
    },

    'real-height': function (viewModel) {
        return getElSize(viewModel.height, 'px', 'height');
    },

    'month-scheduleBlock': function (viewModel, grids, blockHeight, paddingTop) {
        var top = getElSize((viewModel.top - 1) * blockHeight + paddingTop, 'px', 'top');
        var left = getElSize(grids[viewModel.left] ? grids[viewModel.left].left : 0, '%', 'left');
        var width = getElSize(getElWidth(viewModel, grids), '%', 'width');
        var height = getElSize(viewModel.height, 'px', 'height');

        return [top, left, width, height].join(';');
    },

    holiday: function (day) {
        var cssClass = '';

        if (day === 0) {
            cssClass = config.classname('holiday-sun');
        }

        if (day === 6) {
            cssClass = config.classname('holiday-sat');
        }

        return cssClass;
    },

    /**
     * Add supplied two parameter
     * @param {*} a - a
     * @param {*} b - b
     * @returns {number} result of operation
     */
    add: function (a, b) {
        return a + b;
    },

    /**
     * Multiply supplied two parameter
     * @param {*} a - a
     * @param {*} b - b
     * @returns {number} result of operation
     */
    multiply: function (a, b) {
        return a * b;
    },

    /**
     * Divide supplied two parameter
     * @param {*} a - a
     * @param {*} b - b
     * @returns {number} result of operation
     */
    divide: function (a, b) {
        return a / b;
    },

    /**
     * Subtract supplied two parameter
     * @param {*} a - a
     * @param {*} b - b
     * @returns {number} result of operation
     */
    subtract: function (a, b) {
        return a - b;
    },

    getRight: function (a, b) {
        return mmax(0, 100 - (a + b));
    },

    /**
     * Get css prefix in global configuration
     * @returns {string} css prefix
     */
    CSS_PREFIX: function () {
        return config.cssPrefix;
    },

    reverse: function (array) {
        return array.slice().reverse();
    },

    /**********
     * Default schedule template
     **********/

    'milestone-tmpl': function (model) {
        var icon = config.classname('icon');
        var iconName = config.classname('ic-milestone');

        return (
            '<span class="' +
            icon +
            ' ' +
            iconName +
            '"></span><span style="background-color: ' +
            model.bgColor +
            '">' +
            common.stripTags(model.title) +
            '</span>'
        );
    },

    'title-tmpl': function () {
        var icon = config.classname('icon');
        var iconName = config.classname('ic-edit-2');

        return '<span class="' + icon + ' ' + iconName + '"></span>';
    },

    'arrow-tmpl': function () {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    },

    'location-tmpl': function () {
        var icon = config.classname('icon');
        var iconName = config.classname('ic-map-pin');

        return '<span class="' + icon + ' ' + iconName + '" ></span>';
    },

    'text-tmpl': function () {
        return '<span></span>';
    },

    'attendees-tmpl': function () {
        var icon = config.classname('icon');
        var iconName = config.classname('ic-user');

        return '<span class="' + icon + ' ' + iconName + '"></span>';
    },

    'milestoneTitle-tmpl': function () {
        var className = config.classname('left-content');

        return '<span class="' + className + '">Milestone</span>';
    },

    'task-tmpl': function (model) {
        return '#' + model.title;
    },

    'taskTitle-tmpl': function () {
        var className = config.classname('left-content');

        return '<span class="' + className + '">Task</span>';
    },

    'alldayTitle-tmpl': function () {
        var className = config.classname('left-content');

        return '<span class="' + className + '">All Day</span>';
    },

    'allday-tmpl': function (model) {
        return common.stripTags(model.title);
    },

    'time-tmpl': function (model) {
        return common.stripTags(model);
    },

    'goingDuration-tmpl': function (model) {
        var goingDuration = model.goingDuration;
        var hour = parseInt(goingDuration / SIXTY_MINUTES, 10);
        var minutes = goingDuration % SIXTY_MINUTES;

        return (
            'GoingTime ' + datetime.leadingZero(hour, 2) + ':' + datetime.leadingZero(minutes, 2)
        );
    },

    'comingDuration-tmpl': function (model) {
        var goingDuration = model.goingDuration;
        var hour = parseInt(goingDuration / SIXTY_MINUTES, 10);
        var minutes = goingDuration % SIXTY_MINUTES;

        return (
            'ComingTime ' + datetime.leadingZero(hour, 2) + ':' + datetime.leadingZero(minutes, 2)
        );
    },

    'monthMoreTitleDate-tmpl': function (date, dayname) {
        var classDay = config.classname('month-more-title-day');
        var classDayLabel = config.classname('month-more-title-day-label');
        var day = util.pick(date.split('.'), 2);

        return (
            '<span class="' +
            classDay +
            '">' +
            day +
            '</span> <span class="' +
            classDayLabel +
            '">' +
            dayname +
            '</span>'
        );
    },

    'monthMoreClose-tmpl': function () {
        return '';
    },

    'monthGridHeader-tmpl': function (model) {
        var date = parseInt(model.date.split('-')[2], 10);
        var classNames = [];
        // var color = model.color === '#333' ? '#dedede' : model.color;
        var color = '#dedede';
        classNames.push(config.classname('weekday-grid-date'));
        if (model.isToday) {
            classNames.push(config.classname('weekday-grid-date-decorator'));
        }
        // '<span class="' + classNames.join(' ') + '">' + date + '</span>';
        return `<span class="${classNames.join(' ')}" style="${
            model.isToday ? '' : `color:${color}`
        }">${date}</span>`;
    },

    'monthGridHeaderExceed-tmpl': function (hiddenSchedules) {
        var className = config.classname('weekday-grid-more-schedules');

        return '<span class="' + className + '">+' + hiddenSchedules + '</span>';
    },

    'monthGridFooter-tmpl': function () {
        return '';
    },

    /* eslint no-unused-vars: 0 */
    'monthGridFooterExceed-tmpl': function (hiddenSchedules) {
        return '';
    },

    'monthDayname-tmpl': function (model) {
        return model.label;
    },

    'weekDayname-tmpl': function (model) {
        var classDate = config.classname('dayname-date');
        var className = config.classname('dayname-name');
        // var dateColor = model.color !== '#333' && model.color !== '#bbb' ? model.color : '#dedede';
        // var nameColor = model.color !== '#333' && model.color !== '#bbb' ? model.color : '#3f51b5';
        var dateColor = model.isToday ? model.color : '#dedede';
        var nameColor = model.isToday ? model.color : '#3f51b5';
        return `<span class="${classDate}" style="color:${dateColor};">${model.date}</span>&nbsp;&nbsp;<span class="${className}" style="color:${nameColor};">${model.dayName}</span>`;
        // '<span class="' +
        // classDate +
        // '">' +
        // model.date +
        // '</span>&nbsp;&nbsp;<span class="' +
        // className +
        // '">' +
        // model.dayName +
        // '</span>'
    },

    'weekGridFooterExceed-tmpl': function (hiddenSchedules) {
        return '+' + hiddenSchedules;
    },

    'dayGridTitle-tmpl': function (viewName) {
        var tmpl = Handlebars.helpers[viewName + 'Title-tmpl'];
        if (tmpl) {
            return tmpl(viewName);
        }

        return viewName;
    },

    'schedule-tmpl': function (model) {
        var tmpl = Handlebars.helpers[model.category + '-tmpl'];
        if (tmpl) {
            return tmpl(model);
        }

        return '';
    },

    'collapseBtnTitle-tmpl': function () {
        var iconName = config.classname('icon');
        var closeIconName = config.classname('ic-arrow-solid-top');

        return '<span class="' + iconName + ' ' + closeIconName + '"></span>';
    },

    'timezoneDisplayLabel-tmpl': function (timezoneOffset, displayLabel) {
        var gmt, hour, minutes;

        if (util.isUndefined(displayLabel)) {
            gmt = timezoneOffset < 0 ? '-' : '+';
            hour = Math.abs(parseInt(timezoneOffset / SIXTY_MINUTES, 10));
            minutes = Math.abs(timezoneOffset % SIXTY_MINUTES);
            displayLabel =
                gmt + datetime.leadingZero(hour, 2) + ':' + datetime.leadingZero(minutes, 2);
        }

        return displayLabel;
    },

    'timegridDisplayPrimayTime-tmpl': function (time) {
        /* TODO: 삭제 필요 (will be deprecated) */
        return Handlebars.helpers['timegridDisplayPrimaryTime-tmpl'](time);
    },

    'timegridDisplayPrimaryTime-tmpl': function (time) {
        var hour = time.hour;
        var meridiem = hour >= 12 ? 'pm' : 'am';

        if (hour > 12) {
            hour = hour - 12;
        }

        return hour + ' ' + meridiem;
    },

    'timegridDisplayTime-tmpl': function (time) {
        return datetime.leadingZero(time.hour, 2) + ':' + datetime.leadingZero(time.minutes, 2);
    },

    'timegridCurrentTime-tmpl': function (timezone) {
        var templates = [];

        if (timezone.dateDifference) {
            templates.push('[' + timezone.dateDifferenceSign + timezone.dateDifference + ']<br>');
        }

        templates.push(datetime.format(timezone.hourmarker, 'HH:mm'));

        return templates.join('');
    },

    'popupIsAllDay-tmpl': function () {
        return 'All day';
    },

    'popupStateFree-tmpl': function () {
        return 'Free';
    },

    'popupStateBusy-tmpl': function () {
        return 'Busy';
    },

    'titlePlaceholder-tmpl': function () {
        return 'Subject';
    },

    'locationPlaceholder-tmpl': function () {
        return 'Location';
    },

    'startDatePlaceholder-tmpl': function () {
        return 'Start date';
    },

    'endDatePlaceholder-tmpl': function () {
        return 'End date';
    },
    'popupSave-tmpl': function () {
        return 'Save';
    },
    'popupUpdate-tmpl': function () {
        return 'Update';
    },
    'popupDetailDate-tmpl': function (isAllDay, start, end) {
        var isSameDate = datetime.isSameDate(start, end);
        var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm tt';

        if (isAllDay) {
            return (
                datetime.format(start, 'YYYY.MM.DD') +
                (isSameDate ? '' : ' - ' + datetime.format(end, 'YYYY.MM.DD'))
            );
        }

        return (
            datetime.format(start, 'YYYY.MM.DD hh:mm tt') + ' - ' + datetime.format(end, endFormat)
        );
    },
    'popupDetailLocation-tmpl': function (schedule) {
        return schedule.location;
    },
    'popupDetailUser-tmpl': function (schedule) {
        return (schedule.attendees || []).join(', ');
    },
    'popupDetailState-tmpl': function (schedule) {
        return schedule.state || 'Busy';
    },
    'popupDetailRepeat-tmpl': function (schedule) {
        return schedule.recurrenceRule;
    },
    'popupDetailBody-tmpl': function (schedule) {
        return schedule.body;
    },
    'popupEdit-tmpl': function () {
        return 'Edit';
    },
    'popupDelete-tmpl': function () {
        return 'Delete';
    },
    'monthScheduleName-tmpl': function (schedule) {
        var start = schedule.start;

        return msToTime(start);
    },
};

/**
 * Get CSS syntax for element size
 * @param {number} milliseconds - time to milliseconds
 * @returns {string} start time
 */
function msToTime(milliseconds) {
    var time = new Date(milliseconds);
    var minutes = time.getMinutes(),
        hours = time.getHours();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ':' + minutes;
}

/**
 * Get CSS syntax for element size
 * @param {number} value - size value to apply element
 * @param {string} postfix - postfix string ex) px, em, %
 * @param {string} prefix - property name ex) width, height
 * @returns {string} CSS syntax
 */
function getElSize(value, postfix, prefix) {
    prefix = prefix || '';
    if (util.isNumber(value)) {
        return prefix + ':' + value + postfix;
    }

    return prefix + ':auto';
}

/**
 * Get element left based on narrowWeekend
 * @param {object} viewModel - view model
 * @param {Array} grids - dates information
 * @returns {number} element left
 */
function getElLeft(viewModel, grids) {
    return grids[viewModel.left] ? grids[viewModel.left].left : 0;
}

/**
 * Get element width based on narrowWeekend
 * @param {object} viewModel - view model
 * @param {Array} grids - dates information
 * @returns {number} element width
 */
function getElWidth(viewModel, grids) {
    var width = 0;
    var i = 0;
    var length = grids.length;
    var left;
    for (; i < viewModel.width; i += 1) {
        left = (viewModel.left + i) % length;
        left += parseInt((viewModel.left + i) / length, 10);
        if (left < length) {
            width += grids[left] ? grids[left].width : 0;
        }
    }

    return width;
}

Handlebars.registerHelper(helpers);
