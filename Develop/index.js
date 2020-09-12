const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// member array is the item we will push in to our HTML in the buildFile function in the end.
let members = [];

// Questions prompt for user
var questions = [
	{
		type: 'input',
		name: 'name',
		message: "What's your name?",
	},
	{
		type: 'input',
		name: 'id',
		message: "What's your ID number?",
	},
	{
		type: 'input',
		name: 'email',
		message: "What's your Email address?",
	},
	{
		type: 'list',
		name: 'role',
		message: "What's your role in this company?",
		choices: ['Intern', 'Engineer', 'Manager'],
	},

]


// in these if statetements we differintiate between intern, manager, or engineer and build a new object each time that we then push in to our members array on top.
function programStart() {
	inquirer.prompt(questions).then((answers) => {
		if (answers.role == 'Intern') {
			var moreQuestions = [
				{
					type: 'input',
					name: 'school',
					message: 'What is your school name?',
				},
			]
			inquirer.prompt(moreQuestions).then((thisAnswer) => {


				const internData = new Intern(
					answers.name,
					answers.id,
					answers.email,
					answers.role,
				
				)
				members.push(internData)

				restartInquirer()

			})

		} else if (answers.role == 'Engineer') {
			var moreQuestions = [
				{
					type: 'input',
					name: 'github',
					message: 'What is your github username?',
				},
			]
			inquirer.prompt(moreQuestions).then((thisAnswer) => {
				const engineerData = new Engineer(
					answers.name,
					answers.id,
					answers.email,
					answers.role
				)

				members.push(engineerData)
				restartInquirer();

			}

			)

		} else {
			var moreQuestions = [
				{
					type: 'input',
					name: 'officeNumber',
					message: 'What is your office number?',
				},
			]
			inquirer.prompt(moreQuestions).then((thisAnswer) => {

				const managerData = new Manager(
					answers.name,
					answers.id,
					answers.email,
					thisAnswer.officeNumber
				)

				members.push(managerData)
				restartInquirer();
			}
			)

		}
	});
}


// Portion where we either ask the question to continue with adding more users or to actually build the file
	const newQuestion = [
		{
			type: "list",
			message: "Would you like to add a team member?",
			name: "role",
			choices: ["YES!!!", "NOPE, THATS EVERYONE!"]
		}
	];
	function restartInquirer() {
		inquirer.prompt(newQuestion).then(answer => {
			switch (answer.role) {
				case "YES!!!":
					programStart();
					break;

				case "NOPE, THATS EVERYONE!":
					buildFile()
					break;
			}
		});
	}

	function buildFile(){
		if(!fs.existsSync(OUTPUT_DIR)){
			fs.mkdirSync(OUTPUT_DIR)
		}
		fs.writeFileSync(outputPath, render(members))
	}

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ``
programStart();