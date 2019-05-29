function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sampleData){
    
    // Check sampleData
    console.log(sampleData);

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");
   
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Use d3 to append new tags for each key-value in the metadata.
    Object.entries(sampleData).forEach(function ([key, value]){
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
  });  
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(sampleData) {

 // Build a Bubble Chart using the sample data
    const otu_ids = sampleData.otu_ids;
    const otu_labels = sampleData.otu_labels;
    const sample_values = sampleData.sample_values;

 // Building Bubble chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];      

    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
    };

    Plotly.plot('bubble', bubbleData, bubbleLayout);

    // Building Pie Chart
    var pieData = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10,),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var pieLayout = {
      margin: {t: 0, l: 0}
    }

    Plotly.plot('pie', pieData, pieLayout); 

  });
}


 function init() {
   // Grab a reference to the dropdown select element
   var selector = d3.select("#selDataset");

   // Use the list of sample names to populate the select options
   d3.json("/names").then((sampleNames) => {
     sampleNames.forEach((sample) => {
       selector
         .append("option")
         .text(sample)
         .property("value", sample);
     });

     // Use the first sample from the list to build the initial plots
     const firstSample = sampleNames[0];
     buildCharts(firstSample);
     buildMetadata(firstSample);
   });
 }

 function optionChanged(newSample) {
   // Fetch new data each time a new sample is selected
   buildCharts(newSample);
   buildMetadata(newSample);
 }

 // Initialize the dashboard
 init();
