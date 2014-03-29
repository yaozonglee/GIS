# http://rosettacode.org/wiki/Palindrome_detection#R
###############################################################################
palindrome <- function(p) {
  for(i in 1:floor(nchar(p)/2) ) {
    r <- nchar(p) - i + 1
    if ( substr(p, i, i) != substr(p, r, r) ) return(FALSE) 
  }
  TRUE
}

MoranMagnitude <- function(index){
  # Sample code to calculate Moran I for Spatial Point
  
  library(spdep)
  
  # Get spatial points
  ozone <- read.csv("/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/canvas.csv", header=TRUE, sep=",")
  
  # Get coordinates of ozone - to be used for neighbourlist
  coord <- cbind(ozone$longitude,ozone$latitude)
  
  # get neighbour list from nearest neighbour 
  ozone.nb <- knn2nb(knearneigh(coord, k = 1), row.names = ozone$OBJECTID)
  
  # derive row-standardised weights matrix
  ozone.rsw <- nb2listw(ozone.nb)
  
  # convert index to a numeric
  index = as(index,"integer")
  
  # calculate moran
  temp <- moran.test(ozone[,index], ozone.rsw)
  cb <- cbind(temp$estimate[1],temp$p.value)
  return (cb)
}

Quadrat <- function(){
  library(maptools)
  library(spatstat)
  
  
  points <- read.csv("/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/canvas.csv", header=TRUE, sep=",")
  # retrieve points
  coord <- cbind(points$longitude,points$latitude)
  
  # convert points to spatial points
  points.sp <- SpatialPoints(coord)
  
  
  ppp=as(as(points.sp, "SpatialPoints"),"ppp")
  
  # quadrant test
  temp<-quadrat.test(ppp);
  rr <- cbind(temp$statistic,temp$p.value)
  return (rr)
}

## functions start
# function: get linear model using variables as formula
LinearModel <- function(data,target,variables){
  
  # compute formula
  (fmla <- as.formula(paste(target,paste(" ~ ", paste(variables, collapse= "+")))))
  
  # calculate linear model
  indev_lm <- lm(fmla, data = data)
  
  # return
  return(indev_lm)
}

# function: get distance to nearest point

ComputeDistance <- function(pointO, pointT, colName ){
  library(spdep)
  
  #  Define these vectors, used in the loop.
  
  closestSiteVec <- vector(mode = "numeric",length = nrow(pointO))
  minDistVec     <- vector(mode = "numeric",length = nrow(pointO))
  
  for (i in 1 : nrow(pointO))
  {
    distVec <- spDistsN1(pointT,pointO[i,],longlat = TRUE)
    minDistVec[i] <- min(distVec)
    closestSiteVec[i] <- which.min(distVec)
  }
  #
  # Create the Temperature Assignment table: merge the temperature point list with the transect point list
  # into a five-column table by merging the temperature point and transect point lists.
  #
  #PointAssignTemps <- (pointO[closestSiteVec,])
  FinalTable = data.frame(pointO,closestSiteVec,minDistVec)
  # Change distance name
  names(FinalTable)[NCOL(FinalTable)] <-colName
  
  return (FinalTable)
}

# function: get number of points in R radius

CountNinR <- function(pointO, pointT, radius, colName ){
  library(spdep)
  
  #  Define these vectors, used in the loop.
  
  countVec <- vector(mode = "numeric",length = nrow(pointO))
  
  for (i in 1 : nrow(pointO))
  {
    distVec <- spDistsN1(pointT,pointO[i,],longlat = TRUE)
    count = 0
    for(j in 1: nrow(pointT))
    {
      if(distVec[j]<=radius)
      {
        count = count + 1
      }
    }
    countVec[i] <- count
  }
  #
  # Create the Temperature Assignment table: merge the temperature point list with the transect point list
  # into a five-column table by merging the temperature point and transect point lists.
  #
  #PointAssignTemps <- (pointO[closestSiteVec,])
  FinalTable = data.frame(pointO,countVec)
  # Change distance name
  names(FinalTable)[NCOL(FinalTable)] <-colName
  
  return (FinalTable)
}

## functions end


# linear model test
test <- function(){
  library(spdep)
  points.library <- read.csv("C://GIS/R scripts/data/library.csv", header=TRUE, sep=",")
  points.parks <- read.csv("C://GIS/R scripts/data/NPark.csv", header=TRUE, sep=",")
  ## convert to spatial data frames
  coordinates(points.library) <- c("longitude", "latitude")
  coordinates(points.parks) <- c("longitude", "latitude")
  b <- ComputeDistance(points.library,points.parks,"DIST")
  coordinates(b)<- c("longitude", "latitude")
  c <- CountNinR(b,points.parks,4,"COUNT")
  coordinates(c)<- c("longitude", "latitude")
  
  # use linear model
  variables <- paste0("x", 1:2)
  variables[1] = "DIST"
  variables[2] = "COUNT"
  lm <- LinearModel(c,"Rating",variables)
  summary(lm)
  summary(lm)
  b<- summary(lm)
  return (b)
}

test2 <- function(arg){
  print(arg)
  print(names(arg))
  return("heh")
}

QuadratTest<-function(jsonString){
  library(rgdal)
  library(maptools)
  library(spatstat)
  points <- readOGR(dsn=jsonString,layer='OGRGeoJSON')
  
  ppp=as(as(points, "SpatialPoints"),"ppp")
  
  # quadrant test
  temp <- quadrat.test(ppp);
  return (temp)
}