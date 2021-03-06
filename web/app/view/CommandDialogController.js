/*
 * Copyright 2015 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Ext.define('Traccar.view.CommandDialogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.commandDialog',

    onSelect: function (selected) {
        this.lookupReference('paramPositionPeriodic').setHidden(
            selected.getValue() !== 'positionPeriodic');
        this.lookupReference('paramOutputControl').setHidden(
            selected.getValue() !== 'outputControl');
        this.lookupReference('paramSendSmsUssd').setHidden(
            selected.getValue() !== 'sendSms' && selected.getValue() !== 'sendUssd');
        this.lookupReference('paramSmsMessage').setHidden(
            selected.getValue() !== 'sendSms');
        this.lookupReference('paramCustom').setHidden(
            selected.getValue() !== 'custom');
    },

    onSendClick: function (button) {
        var attributes, value, record, form, index, phoneNumber;

        form = button.up('window').down('form');
        form.updateRecord();
        record = form.getRecord();

        if (record.get('type') === 'positionPeriodic') {
            attributes = this.lookupReference('paramPositionPeriodic');
            value = attributes.down('numberfield[name="frequency"]').getValue();
            value *= attributes.down('combobox[name="unit"]').getValue();

            record.set('attributes', {
                frequency: value
            });
        }

        if (record.get('type') === 'outputControl') {
            attributes = this.lookupReference('paramOutputControl');
            index = attributes.down('numberfield[name="index"]').getValue();
            value = attributes.down('textfield[name="data"]').getValue();

            record.set('attributes', {
                index: index,
                data: value
            });
        }

        if (record.get('type') === 'sendUssd') {
            attributes = this.lookupReference('paramSendSmsUssd');
            phoneNumber = attributes.down('textfield[name="phoneNumber"]').getValue();
            record.set('attributes', {
                phoneNumber: phoneNumber
            });
        }

        if (record.get('type') === 'sendSms') {
            attributes = this.lookupReference('paramSendSmsUssd');
            phoneNumber = attributes.down('textfield[name="phoneNumber"]').getValue();
            value = attributes.down('textfield[name="message"]').getValue();
            record.set('attributes', {
                phoneNumber: phoneNumber,
                message: value
            });
        }

        if (record.get('type') === 'custom') {
            value = this.lookupReference('paramCustom').getValue();
            record.set('attributes', {
                data: value
            });
        }

        Ext.Ajax.request({
            scope: this,
            url: 'api/commands',
            jsonData: record.getData(),
            callback: this.onSendResult
        });
    },

    onSendResult: function (options, success, response) {
        if (success) {
            Ext.toast(Strings.commandSent);
            this.closeView();
        } else {
            Traccar.app.showError(response);
        }
    }
});
