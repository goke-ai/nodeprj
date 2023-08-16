
const app = document.getElementById('app');


app.innerHTML = `
<h1>Welcome to the School App.</h1>

<div class="students"></div>
`;


let students = [];

let resp = await fetch('/api/students');
students = await resp.json();

console.log(students);

const studentElt = document.querySelector(".students");


const dataRow = students.map((v, i) =>
  `<tr>
    <td>${v.id}</td>
    <td>${v.matric_no}</td>
    <td>${v.name}</td>
    <td>${v.email}</td>
    <td>${v.program}</td>
    <td>${v.level}</td>
    <td>${v.courses}</td>    
  </tr>
`);

studentElt.innerHTML =
  `<table>
    <thead>
        <tr>
        <th>id</th>
        <th>matric_no</th>
        <th>name</th>
        <th>email</th>
        <th>program</th>
        <th>level</th>
        <th>courses</th>    
        </tr>
    </thead>
    <tbody>
        ${dataRow}
    </tbody>
    <tfoot>
        <tr>
        <td> - </td>
        <td> - </td>
        <td> - </td>
        <td> - </td>
        <td> - </td>
        <td> - </td>
        <td> - </td>
        </tr>
    </tfoot>
  </table>
`;