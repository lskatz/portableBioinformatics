function SmithWaterman(query,subject,sMatrix=[]){
  // Make the substitution matrix
  if(sMatrix.length==0) sMatrix=[
    [-1,-1,-1,-1,-1], // -ACGT
    [-1,1,-1,-1,-1],
    [-1,-1,1,-1,-1],
    [-1,-1,-1,1,-1],
    [-1,-1,-1,-1,1]
  ];
  
  // Add the object properties
  this.query=query;
  this.subject=subject
  this.sMatrix=sMatrix;
}

SmithWaterman.prototype.run=function(){
  // transform to a string of a number with a prefix gap
  query="0"+this.query; 
  subject="0"+this.subject;
  query=query.replace(/A/gi,1).replace(/C/gi,2).replace(/G/gi,3).replace(/T/gi,4);
  subject=subject.replace(/A/gi,1).replace(/C/gi,2).replace(/G/gi,3).replace(/T/gi,4);
  
  // initialize the smith-waterman matrix to 0
  var matrix=new Array;
  for(var i=0;i<query.length;i++){
    matrix[i]=new Array;
    for(var j=0;j<subject.length;j++){
      matrix[i][j]=0;
    }
  }
  
  // Calculate scores in the matrix according to gaps and matches.
  // The first col/row is zero, so no point in starting at zeroth pos.
  var maxInt=0;  // this will come out to be the largest integer in the matrix
  var maxI=0; var maxJ;
  for(var i=1;i<query.length;i++){
    var queryInt=parseInt(query.substr(i,1));
    var lastQueryInt=parseInt(query.substr(i-1,1));
    for(var j=1;j<subject.length;j++){
      var subjectInt=parseInt(subject.substr(j,1));
      var lastSubjectInt=parseInt(subject.substr(j-1,1));
      var north=matrix[i-1][j]+ this.sMatrix[lastQueryInt][subjectInt];
      var west=matrix[i][j-1] + this.sMatrix[queryInt][lastSubjectInt];
      var nw=matrix[i-1][j-1] + this.sMatrix[queryInt][subjectInt];
      
      // Find which value is largest, for this cell of the matrix
      var localMax=Math.max(0,north,west,nw);
      
      // If this is the largest value, mark it.
      if(localMax > maxInt){
        maxInt=localMax
        maxI=i
        maxJ=j
      }
      matrix[i][j]=localMax;
    }
  }
  
  // Find the path through the matrix.
  // Start with the highest score and work your way diagonally
  // until the localScore reaches 0.
  // Capture the path, total score, and the match string.
  i=maxI; 
  j=maxJ;
  var localScore=maxInt;
  var totalScore=localScore;
  var swPath=[[i,j]]; // will be an array of coordinates
  //var matchString=query.substr(i,1); // first in the match string is a match
  while(localScore > 0){
    // Figure out the path to the next highest score.
    // Choices are: north, west, and NW
    var scores=[]
    scores[0]=0; // prevent any negative numbers from Math.max()
    scores[matrix[i-1][j]]=[i-1,j];
    scores[matrix[i][j-1]]=[i,j-1];
    scores[matrix[i-1][j-1]]=[i-1,j-1];
    
    
    // Add up the points for the score as we go...
    var keys=Object.keys(scores);
    localScore=Math.max.apply(Math, keys);
    totalScore+=localScore;
    
    // Keep track of the path
    var nextCell=scores[localScore];
    swPath.push(nextCell);
    i=nextCell[0];
    j=nextCell[1];
    
  }
  
  // Reverse the match string and path to put it in a 'left to right' order
  swPath=swPath.reverse();
  //matchString=matchString.split('').reverse().join('');
  
  return [totalScore,swPath];
}
