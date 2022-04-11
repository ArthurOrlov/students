function firstLetter(str) {
  if (str == '') return str;
  let strOne = str.toLowerCase().trim();
  let strTwo = strOne[0].toUpperCase() + strOne.slice(1);
  return strTwo;
}

const students = [
  {
    name: 'Иван',
    surname: 'Иванов',
    patronymic: 'Иванович',
    birthday: new Date(1990, 12, 10),
    educationStart: 2020,
    faculty: 'Экономика'
  },
  {
    name: 'Петр',
    surname: 'Петров',
    patronymic: 'Петрович',
    birthday: new Date(1990, 01, 10),
    educationStart: 2020,
    faculty: 'Филфак'
  }
];

let filteredStudents = [];

const btnAdd = document.querySelector('.button-add');
const formAdd = document.querySelector('.form_add');
const table = document.getElementById('sortable');
const tbody = document.getElementById('table-body');
const filter = document.querySelectorAll('.filter_input');

Object.assign(filteredStudents, students);

filter.forEach(item => {
  item.addEventListener('input', e =>{
    const self = e.target;
    Object.assign(filteredStudents, students);

    filter.forEach(item => {
      if (item.value.length){
        const self = item;
        switch (item.getAttribute('data-filter')) {
          case 'fio':
            filteredStudents = filteredStudents.filter(item => {
              if (`${item.surname} ${item.name} ${item.patronymic}`.toLowerCase().includes(self.value.toLowerCase())){
                return item;
              }
            })
            break;
          case 'faculty':
            filteredStudents = filteredStudents.filter(item => {
              if (`${item.faculty}`.toLowerCase().includes(self.value.toLowerCase())){
                return item;
              }
            })
            break;
          case 'admission':
            filteredStudents = filteredStudents.filter(item => {
              if (`${item.educationStart}` === self.value){
                return item;
              }
            })
            break;
          case 'graduation':
            filteredStudents = filteredStudents.filter(item => {
              if (`${parseInt(item.educationStart) + 4}` === self.value){
                return item;
              }
            })
            break;
        }
      }
    })

    createTable(filteredStudents);
  })
})

table.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn_order')){
    const orderedStudents = [];
    Object.assign(orderedStudents, filteredStudents);
    switch (e.target.getAttribute('data-sort')) {
      case 'fio':
        orderedStudents.sort((prev, next) => {
          if ( `${prev.surname} ${prev.name} ${prev.patronymic}` < `${next.surname} ${next.name} ${next.patronymic}` ) return -1;
          if ( `${prev.surname} ${prev.name} ${prev.patronymic}` < `${next.surname} ${next.name} ${next.patronymic}` ) return 1;
        });
        createTable(orderedStudents);
        break;
      case 'faculty':
        orderedStudents.sort((prev, next) => {
          if ( prev.faculty < next.faculty ) return -1;
          if ( prev.faculty < next.faculty ) return 1;
        });
        createTable(orderedStudents);
        break;
      case 'birthday':
        orderedStudents.sort((prev, next) => prev.birthday - next.birthday);
        createTable(orderedStudents);
        break;
      case 'educationStart':
        orderedStudents.sort((prev, next) => prev.educationStart - next.educationStart);
        createTable(orderedStudents);
        break;
      default:
      break;
    }
  }
})

const wordEnding = (number, txt) => {
  var cases = [2, 0, 1, 1, 1, 2];
  return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

const createTable = students => {

  tbody.innerHTML = '';

  const curDate = new Date();

  students.forEach((item)=>{
    const row = document.createElement('tr');

    const colFIO = document.createElement('td');
    const colFaculty = document.createElement('td');
    const colBirthday = document.createElement('td');
    const colEducationDate = document.createElement('td');

    colFIO.innerText = `${item.surname} ${item.name} ${item.patronymic}`;
    row.append(colFIO);

    colFaculty.innerText = item.faculty;
    row.append(colFaculty);

    const birthdayNormalFormat = `${item.birthday.getDate()}.${item.birthday.getMonth()+1}.${item.birthday.getFullYear()}`
    const years = wordEnding(new Date(curDate - item.birthday).getFullYear() - 1970, ['год', 'года', 'лет']);
    colBirthday.innerText = `${birthdayNormalFormat} (${new Date(curDate - item.birthday).getFullYear() - 1970} ${years})`;
    row.append(colBirthday);


    const educationEndDate = new Date(parseInt(item.educationStart) + 4, 8, 1);

    let educationStatus = new Date(educationEndDate - curDate).getFullYear() - 1970;

    educationStatus = (educationStatus < 0)?'закончил':4-educationStatus;

    educationStatus = (educationStatus <= 0)?'Не начал':educationStatus;

    colEducationDate.innerText = `${item.educationStart}-${educationEndDate.getFullYear()} (${educationStatus} курс)`;
    row.append(colEducationDate);

    tbody.append(row);
  })
}

formAdd.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.querySelector('#name');
  const surname = document.querySelector('#surname');
  const patronymic = document.querySelector('#patronymic');
  const birthday = document.querySelector('#birthday');
  const educationStart = document.querySelector('#educationStart');
  const faculty = document.querySelector('#faculty');

  const curDate = new Date();

  formAdd.querySelectorAll('input').forEach((i)=>{
    i.classList.remove('is-invalid');
    if (!i.value.trim().length){
      i.classList.add('is-invalid');
      return false;
    }
  })

  const checkBirthDate = new Date('01.01.1900');
  if ((birthday.valueAsDate < checkBirthDate) || (birthday.valueAsDate > curDate)){
    birthday.classList.add('is-invalid');
  }

  if ((educationStart.value < 2000) || (educationStart.valueAsDate > curDate.getFullYear())){
    educationStart.classList.add('is-invalid');
  }

  if (formAdd.querySelectorAll('.is-invalid').length){
    return false;
  }

  const student = {
    name: name.value,
    surname: surname.value,
    patronymic: patronymic.value,
    birthday: birthday.valueAsDate,
    educationStart: educationStart.value,
    faculty: faculty.value
  }

  students.push(student);
  Object.assign(filteredStudents, students);

  createTable(students);
})

createTable(students)
