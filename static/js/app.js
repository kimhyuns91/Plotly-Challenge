function initialScreen(){
    // Select the dropdown field
    var dropdown=d3.select("#selDataset");

    //Access the json file
    d3.json("data/samples.json").then((data) => {

        //Display ID selection    
        data.names.map(function(name) {
            dropdown.append("option").text(name);
        });

        //Display Plots and description on the first ID available
        plots(data.names[0]);
        demograph(data.names[0]);

    });
};    

initialScreen();

// Creating function to update the plots
function plots(id){

    // Access the json file
    d3.json("data/samples.json").then((data) => {

    // Select the array of object that matches the selected ID
    var otuData=data.samples.filter(row => row.id.toString() === id)[0]; 

    // Select the top 10 IDs and reverse the orders for plotting
    var sampleValues=otuData.sample_values.slice(0,10).reverse();
    var otuID=otuData.otu_ids.slice(0,10).reverse();

    // Select the ID to display on y-axis
    var otuIDs=otuID.map(number => `OTU ${number}`)
        // console.log(otuIDs)

    // Select labels to display when hovered
    var otuLabels=otuData.otu_labels.slice(0,10).reverse();
        //console.log(otuLabels)
        
    // Set Trace for bar plot
    var trace1 = {
        x: sampleValues,
        y: otuIDs,
        type: "bar",
        text: otuLabels,
        orientation: "h",
        // marker: {color: "#008B8B"}
    };

    var data=[trace1];

    // Layout for bar plot
    var layout ={
        title: "Top 10 OTU"
    }

    // Plot bar plot
    Plotly.newPlot("bar", data, layout);

    // Select ID and values for bubble plot
    var otuIDBubble=otuData.otu_ids;
    var sampleValues=otuData.sample_values;

    var otuLabels=otuData.otu_labels

    // Set Trace for bubble plot
    var trace2 = {
        x: otuIDBubble,
        y: sampleValues,
        marker: {
            size: sampleValues,
            color:otuID,
            colorscale: "Earth"
        },
        mode: 'markers',
        text: otuLabels
        
    };
        
    var data2 = [trace2];
    
    // Set layout for bubble plot
    var layout = {
        xaxis:{title:"OTU_IDS"},
        height: 600,
        width: 1200,
        sizemode:"area",
        hovermode:"closet"

    };
    
    // Plot bubble plto
    Plotly.newPlot('bubble', data2, layout);

    });

};

// Add demographic information
function demograph(id){
    // Access json file
    d3.json("data/samples.json").then((data) => {
        var metaData=data.metadata;
        // console.log(sampleData)

        //  Select metadata that matches selected ID
        var selectedData=metaData.filter(row => row.id.toString() === id)[0];
        var demographic=d3.select("#sample-metadata");

        demographic.html("");

        //Append demographic information on panel by ID
        Object.entries(selectedData).forEach(([key, value]) => {
            demographic.append("h5").text(`${key.toUpperCase()} : ${value}`);
            console.log(key)
        });
    });
};

// Function to update the information shown on the page when the selected ID changes
function optionChanged(id) {
    plots(id);
    demograph(id);
}