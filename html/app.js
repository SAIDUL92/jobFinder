const renderHtml = document.querySelector(".jobs-list");
const lwsSearchJob = document.getElementById("lws-searchJob");
const lwsSort = document.getElementById("lws-sort");

async function getJobs(url) {
  const response = await fetch(url);
  const jobs = await response.json();
  let defaultData = [...jobs];

  renderJobsHtml(defaultData);

  document.querySelectorAll(".sub-menu").forEach((ele) => {
    ele.addEventListener("click", function (e) {
      e.preventDefault();
      const pathValue = this.pathname.replace("/", "").trim().toLowerCase();
      console.log(pathValue);
      const test = jobs.filter((jobsFilter) => {
        console.log(jobsFilter.type);
        return jobsFilter.type
          .replace(/\s+/g, "")
          .toLowerCase()
          .includes(pathValue.toLowerCase());
      });

      const newdefaultData = [...test];

      lwsSort.addEventListener("input", function (e) {
        const selectedValue = e.target.value.toLowerCase();
        if (selectedValue === "default") {
          renderJobsHtml(newdefaultData);
        }
        if (selectedValue === "high") {
          const HighToLow = test.sort(function (a, b) {
            return Number(b.salary) - Number(a.salary);
          });

          renderJobsHtml(HighToLow);
        }
        if (selectedValue === "low") {
          const lowToHigh = test.sort(function (a, b) {
            return Number(a.salary) - Number(b.salary);
          });

          renderJobsHtml(lowToHigh);
        }
      });

      renderJobsHtml(test);
    });
  });

  lwsSearchJob.addEventListener("input", function (e) {
    const inputValue = e.target.value;
    const filteredJobs = jobs.filter((jobsFilter) => {
      return jobsFilter.title
        .replace(/\s+/g, "")
        .toLowerCase()
        .includes(inputValue.toLowerCase());
    });

    renderJobsHtml(filteredJobs);
  });

  lwsSort.addEventListener("input", function (e) {
    const selectedValue = e.target.value.toLowerCase();
    if (selectedValue === "default") {
      renderJobsHtml(defaultData);
    }
    if (selectedValue === "high") {
      const HighToLow = jobs.sort(function (a, b) {
        return Number(b.salary) - Number(a.salary);
      });

      renderJobsHtml(HighToLow);
    }
    if (selectedValue === "low") {
      const lowToHigh = jobs.sort(function (a, b) {
        return Number(a.salary) - Number(b.salary);
      });

      renderJobsHtml(lowToHigh);
    }
  });

  function renderJobsHtml(data) {
    document.querySelector(".jobs-list").innerHTML = data
      .map((singleJob) => {
        return `
  
                          <div id="${singleJob.id}" class="lws-single-job">
                            <div class="flex-1 min-w-0">
                              <h2 class="lws-title">${singleJob.title}</h2>
                              <div class="job-footers">
                                <div class="lws-type">
                                  <!-- Fulltime - #FF8A00,  --><!-- Internship - #FF5757,  --><!-- Remote - #56E5C4,  -->
                                  <i
                                    class="fa-solid fa-stop !text-[${
                                      singleJob.type === "FullTime"
                                        ? "#FF8A00"
                                        : singleJob.type === "Internship"
                                        ? "#FF5757"
                                        : singleJob.type === "Remote"
                                        ? "#56E5C4"
                                        : "#FF8A00"
                                    }] text-lg mr-1.5"
                                  ></i>
                                  ${singleJob.type}
                                </div>
                                <div class="lws-salary">
                                  <i
                                    class="fa-solid fa-bangladeshi-taka-sign text-slate-400 text-lg mr-1.5"
                                  ></i>
                                  BDT ${singleJob.salary}
                                </div>
                                <div class="lws-deadline">
                                  <i
                                    class="fa-regular fa-calendar text-slate-400 text-lg mr-1.5"
                                  ></i>
                                  Closing on ${singleJob.deadline}
                                </div>
                              </div>
                            </div>
                            <div class="mt-5 flex lg:mt-0 lg:ml-4">
                              <span class="hidden sm:block">
                                <button type="button" class="lws-edit btn btn-primary">
                                  <i class="fa-solid fa-pen text-gray-300 -ml-1 mr-2"></i>
                                  Edit
                                </button>
                              </span>
  
                              <span class="sm:ml-3">
                                <button type="button" class="lws-delete btn btn-danger">
                                  <i class="fa-solid fa-trash text-gray-300 -ml-1 mr-2"></i>
                                  Delete
                                </button>
                              </span>
                            </div>
                          </div>
                          `;
      })
      .join("");

    document.querySelectorAll(".lws-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.closest(".lws-single-job").getAttribute("id");
        window.location.href = "edit-Job.html?id=" + encodeURIComponent(id);
      });
    });

    document.querySelectorAll(".lws-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.closest(".lws-single-job").getAttribute("id");
        deletePost(`http://localhost:9000/jobs/${id}`, jobs, id);
      });
    });
  }

  function deletePost(url, jobs, id) {
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const deletedData = jobs.filter((fillData) => fillData.id !== Number(id));
    const newdefaultData = [...deletedData];

    lwsSort.addEventListener("input", function (e) {
      const selectedValue = e.target.value.toLowerCase();
      if (selectedValue === "default") {
        renderJobsHtml(newdefaultData);
      }
      if (selectedValue === "high") {
        const HighToLow = deletedData.sort(function (a, b) {
          return Number(b.salary) - Number(a.salary);
        });

        renderJobsHtml(HighToLow);
      }
      if (selectedValue === "low") {
        const lowToHigh = deletedData.sort(function (a, b) {
          return Number(a.salary) - Number(b.salary);
        });

        renderJobsHtml(lowToHigh);
      }
    });

    renderJobsHtml(deletedData);
  }
}

getJobs("http://localhost:9000/jobs");
