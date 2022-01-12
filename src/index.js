import { fetchRepoLanguage, fetchRepos, fetchUser } from "./fetch.js";
import { $, $$ } from "./utils.js";

google.charts.load("current", { packages: ["corechart"] });

const USER_NAME = "newri0807";
let repoName = [];

function getDataTable(object) {
  return Object.entries(object);
}

function convertNullableText(text) {
  if (text === `undefined`) {
  }
}

function attachUserLink(USER_NAME) {
  $(".overview").href = `https://github.com/${USER_NAME}`;
  $(".repositories").href = `https://github.com/${USER_NAME}?tab=repositories`;
  $(".projects").href = `https://github.com/${USER_NAME}?tab=projects`;
}

function renderUserInfo(userInfo) {
  $(".profile img").src = userInfo.avatar_url;
  $(".nickname").innerText = USER_NAME;
  $(".name").innerText = userInfo.name;
  $(".words").innerText = userInfo.bio;
  $(".followers").innerText = userInfo.followers;
  $(".following").innerText = userInfo.following;
  $(".location").innerText = convertNullableText(userInfo.location);
  $(".email").innerText = convertNullableText(userInfo.email);
}

function renderLanguageChart(dataTable) {
  if (!dataTable) {
    return;
  }

  const dataTableHeader = ["언어", "작성된 코드 라인"];

  const data = google.visualization.arrayToDataTable([
    dataTableHeader,
    ...dataTable
  ]);

  const options = {
    title: "",
    pieHole: 0.4
  };

  const chart = new google.visualization.PieChart(
    document.querySelector("#language-chart")
  );
  chart.draw(data, options);
}

// my trying.. ✨
// function renderRepoList(repos) {
//   let list = Array.from($$(".title"));

//   list.forEach((key, index) => {
//     list[index].innerText = repos[index].name;
//   });

//   for (let i = 0; i < repos.length; i++) {
//     repoName.push(repos[i].language);
//     console.log(repoName);
//   }
// }

function renderRepoList(repos) {
  $(".repositories .wrapper").innerHTML = repos
    .map(
      (repo) => `
    <a href=${repo.html_url} class="repository">
      <span class="title">${repo.name}</span>
      <span class="public">${repo.visibility}</span>
    </a>
  `
    )
    .join("");
}

// my trying.. ✨
// function renderPortfolio() {
//   fetchRepos(USER_NAME).then((repos) => renderRepoList(repos));
//   fetchUser(USER_NAME).then((repos) => renderUserInfo(repos));
//   attachUserLink(USER_NAME);

//   const totalLanguage = {};

//   fetchRepoLanguage(USER_NAME, repoName);

//   const languageDataTable = getDataTable(totalLanguage);
//   renderLanguageChart(languageDataTable);
// }

function renderPortfolio() {
  const totalLanguage = {};
  attachUserLink();

  // Render User Info
  fetchUser(USER_NAME).then((userInfo) => {
    renderUserInfo(userInfo);
  });

  // Render Language Chart
  fetchRepos(USER_NAME)
    .then((repos) => {
      renderRepoList(repos);

      return Promise.all(
        repos.map((repo) =>
          fetchRepoLanguage(USER_NAME, repo.name).then((language) => {
            Object.keys(language).forEach((languageName) => {
              if (languageName in totalLanguage) {
                totalLanguage[languageName] += language[languageName];
                return;
              }

              totalLanguage[languageName] = language[languageName];
            });
          })
        )
      );
    })
    .then(() => {
      const languageDataTable = getDataTable(totalLanguage);
      renderLanguageChart(languageDataTable);
    });
}

renderPortfolio();
