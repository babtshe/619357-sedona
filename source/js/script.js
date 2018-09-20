document.addEventListener('DOMContentLoaded', ready);

function ready() { //DOM загрузился и ладно, фиг с картинками и css
  var bookingLink = document.querySelector('.booking__btn');
  var bookingForm = document.querySelector('.booking-form');
  if (bookingLink && bookingForm) { //формочку показываем на главной
    bookingForm.classList.add('booking-form--hidden'); //но сначала спрячем

    var numberDecrease = bookingForm.querySelectorAll('.custom-number__decrease');
    for (var i = 0; i < numberDecrease.length; i++) {
      numberDecrease[i].addEventListener('click', updateNumber);
    }

    var numberIncrease = bookingForm.querySelectorAll('.custom-number__increase');
    for (var i = 0; i < numberIncrease.length; i++) {
      numberIncrease[i].addEventListener('click', updateNumber);
    }

    var numberFields = document.querySelectorAll('.custom-number__input');
    for (var i = 0; i < numberFields.length; i++) {
      numberFields[i].addEventListener('change', updateNumber);
    }

    var dateFields = document.querySelectorAll('.booking-form__field--date input');

    bookingForm.addEventListener('submit', validateAll); //проверим значения при попытке отправить
    bookingLink.addEventListener('click', function (evt) {
      bookingForm.classList.toggle('booking-form--hidden');
    })

    function updateNumber(evt) { //обработка кнопочек - и +
      if (evt.target.classList.contains('custom-number__decrease')) {
        var changeInput = evt.target.nextElementSibling;
        if (changeInput.classList.contains('custom-number__input') && changeInput.value >= 1) {
          changeInput.value -= 1;
        }
      } else if (evt.target.classList.contains('custom-number__increase')) {
        var changeInput = evt.target.previousElementSibling;
        if (changeInput.classList.contains('custom-number__input')) {
          changeInput.value = parseInt(changeInput.value) + 1;
        }
      } else if (evt.target.classList.contains('custom-number__input')) { //туристов не может быть меньше нуля
        var changeInput = evt.target;
        if (changeInput.value < 0 || changeInput.value == '') {
          changeInput.value = 0;
        }
      }
      evt.preventDefault();
    }

    function validateAll(evt) {
      console.log('validate form');
      var touristsCount = 0; //проверим туристов
      for (var i = 0; i < numberFields.length; i++) {
        if (parseInt(numberFields[i].value) >= 0) {
          touristsCount += parseInt(numberFields[i].value);
        }
      }
      if (touristsCount <= 0) { //туристов больше нуля должно быть
        evt.preventDefault();
        for (var i = 0; i < numberFields.length; i++) {
          if (numberFields[i].classList.contains('error-animation')) {
            numberFields[i].classList.toggle('error-animation');
            numberFields[i].classList.toggle('error-animation--toggle');
          } else if (numberFields[i].classList.contains('error-animation--toggle')) {
            numberFields[i].classList.toggle('error-animation');
            numberFields[i].classList.toggle('error-animation--toggle');
          } else {
            numberFields[i].classList.toggle('error-animation');
          }
        }
      }
    }
  }
}

window.onload = function () {
  //double-range==============================================================================
  //все базовые значения вводятся в html
  //можно допилить ещё управление с клавиатуры
  //и проверку введённых значений.
  var doubleRange = document.querySelector('.double-range__slider');
  if (doubleRange) {
    var isDown = false; // нажата ли левая кнопка мышки
    var offset = 0;
    var handle = null;
    var valueFrom = parseInt(document.querySelector('.double-range__input--start').dataset.min);
    var valueTo = parseInt(document.querySelector('.double-range__input--end').dataset.max);
    var handles = document.querySelectorAll('.double-range__handle');
    var handleFrom = document.querySelector('.double-range__handle--start');
    var handleTo = document.querySelector('.double-range__handle--end');
    var sliderRange = document.querySelector('.double-range__range');
    var inputFrom = document.querySelector('.double-range__input--start');
    var inputTo = document.querySelector('.double-range__input--end');

    if (handleFrom && handleTo) { //отслеживаем клики по ручкам
      handleFrom.addEventListener('mousedown', mouseDown, false);
      handleFrom.addEventListener('click', function (event) { //ссылки реагируют на таб, но не реагируют на клик
        event.preventDefault();
      }, false);
      handleTo.addEventListener('mousedown', mouseDown, false);
      handleTo.addEventListener('click', function (event) {
        event.preventDefault();
      }, false);
      initialiseRange();
    }

    for (var i = 0; i < handles.length; i++) { //а пусть на мобиле тоже работает
      handles[i].addEventListener('touchstart', mouseDown, false);
    }


    function initialiseRange() { //подставим значения ползунков и фона по умолчанию как в макете
      var firstHandle = calcWidth(inputFrom.value, valueTo);
      var lastHandle = calcWidth(inputTo.value, valueTo);
      handleFrom.style.left = firstHandle + '%';
      handleTo.style.left = lastHandle + '%';
      sliderRange.style.left = firstHandle + '%';
      sliderRange.style.width = (lastHandle - firstHandle) + '%'; //размер фона
    }

    function updateValues(handle) { //меняем значение полей при изменении положения ручек
      if (handle == handleFrom) {
        var val = (Math.round(parseInt(handleFrom.style.left) * valueTo / 100));
        inputFrom.value = val;
      } else {
        var val = (Math.round(parseInt(handleTo.style.left) * valueTo / 100));
        inputTo.value = val;
      }
    }

    function calcWidth(curValue, maxValue) { //считаем ширину в процентах
      if (maxValue >= 0) {
        return Math.round(curValue / maxValue * 100);
      } else {
        return 0;
      }
    }

    function mouseDown(event) { //реагирует только на левую кнопку. upd теперь ещё и на тачскрин
      if (event.button === 0 || event.type == 'touchstart') {
        isDown = true;
        event.preventDefault();
        handle = event.currentTarget;
        offset = event.currentTarget.offsetLeft - event.clientX + 10;
        if (event.type == 'touchstart') {
          offset = event.currentTarget.offsetLeft - event.touches[0].clientX + 10;
        }

        document.addEventListener('mouseup', function () {
          if (event.button === 0) {
            isDown = false;
          }
        }, true)

        document.addEventListener('touchend', function () {
          isDown = false;
        }, true)

      }
    }

    document.addEventListener('mousemove', mouseMove, true);
    document.addEventListener('touchmove', mouseMove, true);

    function mouseMove(event) {
      if (isDown) {
        if (!event.type == 'touchmove') {
          event.preventDefault();
        }
        var minValue = 0;
        var maxValue = doubleRange.clientWidth;
        var moveDistance = event.clientX + offset;
        if (event.type == 'touchmove') {
          var moveDistance = event.touches[0].clientX + offset;
        }
        if (moveDistance < minValue) {
          moveDistance = minValue;
        } else if (moveDistance > maxValue) {
          moveDistance = maxValue;
        }
        moveDistance = calcWidth(moveDistance, maxValue);
        if (handle == handleFrom) { //первая ручка
          if (moveDistance > parseInt(handleTo.style.left)) { //не пускаем за вторую
            moveDistance = parseInt(handleTo.style.left);
          }
          handleFrom.style.left = moveDistance + '%';
          updateValues(handleFrom);
          sliderRange.style.left = handleFrom.style.left;
          sliderRange.style.width = parseInt(handleTo.style.left) - parseInt(handleFrom.style.left) + '%';
        } else { //вторая ручка
          if (moveDistance < parseInt(handleFrom.style.left)) { //не пускаем за первую
            moveDistance = parseInt(handleFrom.style.left);
          }
          handleTo.style.left = moveDistance + '%';
          updateValues(handleTo);
          sliderRange.style.width = parseInt(handleTo.style.left) - parseInt(handleFrom.style.left) + '%';
        }
      }
    }
  }
}
