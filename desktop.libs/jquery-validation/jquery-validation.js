include('../../libs/jquery-validation/dist/jquery.validate.js');
include('../../libs/jquery-validation/dist/additional-methods.js');

modules.require(['App'], function(App) {
    if (App.lang == 'ru') {
        jQuery.extend(jQuery.validator.messages, {
            required:    "Это поле необходимо заполнить.",
            remote:      "Пожалуйста, введите правильное значение.",
            email:       "Пожалуйста, введите корректный адрес электронной почты.",
            url:         "Пожалуйста, введите корректный URL.",
            date:        "Пожалуйста, введите корректную дату.",
            dateISO:     "Пожалуйста, введите корректную дату в формате ISO.",
            number:      "Пожалуйста, введите число.",
            digits:      "Пожалуйста, вводите только цифры.",
            creditcard:  "Пожалуйста, введите правильный номер кредитной карты.",
            equalTo:     "Пожалуйста, введите такое же значение ещё раз.",
            accept:      "Пожалуйста, выберите файл с правильным расширением.",
            maxlength:   jQuery.validator.format("Пожалуйста, введите не больше {0} символов."),
            minlength:   jQuery.validator.format("Пожалуйста, введите не меньше {0} символов."),
            rangelength: jQuery.validator.format("Пожалуйста, введите значение длиной от {0} до {1} символов."),
            range:       jQuery.validator.format("Пожалуйста, введите число от {0} до {1}."),
            max:         jQuery.validator.format("Пожалуйста, введите число, меньшее или равное {0}."),
            min:         jQuery.validator.format("Пожалуйста, введите число, большее или равное {0}."),
            letterswithbasicpuncRU: "Пожалуйста, вводите только символы алфавита.",
            phoneInternational: "Пожалуйста, введите корректный номер телефона.",
            require_from_group: jQuery.validator.format("Пожалуйста, заполните по крайней мере, {0} из этих полей.")
        });
    }
});

$.validator.addMethod("letterswithbasicpuncRU", function (value, element) {
    return this.optional(element) || /^[a-zа-я\-.,()'"\s]+$/i.test(value);
}, "Letters or punctuation only please");

$.validator.addMethod("phoneInternational", function (value, element) {
    return this.optional(element) || /^[0-9\-.,()\+'"\s]+$/i.test(value);
}, "Please specify a valid phone number");