$(function(){

    var s_done = false;
    var ss_done = false;
    var category = <%-JSON.stringify(category)%>;
    var section = 1;
    var subSection = 0;
    
    while(!s_done){
        while(!ss_done){
            $.ajax({
            type:'GET',
            url: `${category}/${section}/${subSection}`,
            async: false,
            dataType: "json",
            success: function(data){
                if(data.length > 0){

                    //if checklist contains no sub sections format as follows
                    if(data[0].subSectionNum == 0){
                        $('#checklist').append(`
                        <div class="row">
                            <div class="col-12">
                                <section class="box">
                                    <h3>${data[0].sectionNum}. ${data[0].sectionStr}</h3>
                                
                                    <h4>
                                        Section N/A
                                        <input type="checkbox" id="NA${data[0].sectionNum}">
                                        <label for="NA${data[0].sectionNum}"></label>
                                    </h4>

                                    <div class="table-wrapper">
                                        <table class="alt qh-s${data[0].sectionNum}ss${data[0].subSectionNum}">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Points</th>
                                                    <th>Completed</th>
                                                    <th>Upload</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    <p>probably where the section comments should go but later tho</p>

                                </section>
                            </div>
                        </div>
                        `);
                    }

                    //if checklist contains one sub sections format as follows
                    else if(data[0].subSectionNum == 1){
                        $('#checklist').append(`
                        <div class="row">
                            <div class="col-12">
                                <section class="box">
                                    <h3>${data[0].sectionNum}. ${data[0].sectionStr}</h3>
                                
                                    <div class="ssh-s${data[0].sectionNum}">

                                    <h4>
                                        ${data[0].subSectionNum}. ${data[0].subSectionStr}
                                        Section N/A
                                        <input type="checkbox" id="NA${data[0].sectionNum}">
                                        <label for="NA${data[0].sectionNum}"></label>
                                    </h4>

                                    <div class="table-wrapper">
                                        <table class="alt qh-s${data[0].sectionNum}ss${data[0].subSectionNum}">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Points</th>
                                                    <th>Completed</th>
                                                    <th>Upload</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    </div>
                                    <p>probably where the section comments should go but later tho</p>

                                </section>
                            </div>
                        </div>
                    `);
                    }

                    //if section contains more than one sub section, append the rest
                    else{
                        console.log(`.ssh-s${data[0].sectionNum}ss${data[0].subSectionNum}`);
                        $(`.ssh-s${data[0].sectionNum}`).append(`
                        <h4>
                            ${data[0].subSectionNum}. ${data[0].subSectionStr}
                            Section N/A
                            <input type="checkbox" id="NA${data[0].sectionNum}">
                            <label for="NA${data[0].sectionNum}"></label>
                        </h4>

                        <div class="table-wrapper">
                            <table class="alt qh-s${data[0].sectionNum}ss${data[0].subSectionNum}">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Points</th>
                                        <th>Completed</th>
                                        <th>Upload</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        `)
                    }

                    //fill each section / sub section with questions
                    for(var i = 0; i < data.length; i++){
                        $(`.qh-s${data[i].sectionNum}ss${data[i].subSectionNum}`).append(`
                        <tbody>
                            <tr>
                                <td>${data[i].questionNum}. ${data[i].questionStr}</td>
                                <td style="text-align:center;">${data[i].point}</td>

                                <td>
                                    <input type="checkbox" id="cb-s${data[i].sectionNum}q${data[i].questionNum}" name="s${data[i].sectionNum}q${data[i].questionNum}">
                                    <label for="cb-s${data[i].sectionNum}q${data[i].questionNum}"></label>
                                </td>

                                <td id="up-s${data[i].sectionNum}q${data[i].questionNum}"></td>
                            </tr>

                            <tr>
                                <td>testing stuff here pls ignore lmao</td>
                                <td></td> <td></td> <td></td>
                            </tr>
                        </tbody>

                        `);

                        //if upload option avaible insert one
                        if(data[i].upload){
                            $(`#up-s${data[i].sectionNum}q${data[i].questionNum}`).append(`
                                <div class="uploadBttn">
                                    <button class="bttn">Upload a file</button>
                                        <input type="file">
                                </div>
                            `);
                        }
                    }

                }
                if(data.length == 0 && subSection != 0){
                    subSection = 0;
                    ss_done = true;
                }
            }//end ajax success
            }); //end ajax call
            subSection++;
        }//end inner while

        section++;
        $.ajax({
            type:'GET',
            url: `${category}/${section}`,
            async: false,
            dataType: "json",
            success: function(data){
                if(data.length == 0){
                    console.log(`end on ${section}`);
                    s_done = true;
                }
            }
        });
    }//end outer while
});