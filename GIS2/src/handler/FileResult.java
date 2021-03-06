package handler;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;

import org.rosuda.REngine.REXP;
import org.rosuda.REngine.Rserve.RConnection;

public class FileResult {
	
	ArrayList<String> result;
	static HashMap<String, String> userFileList = new HashMap<String,String>();
	static String targetMag = "";
	
	public FileResult(String data, String functionName, String mag, String fileName){
		RConnection c = null;
		try {
			c = new RConnection();
			c.eval("source(\""+OurUtility.RScriptPath+"\")");

			// write to temp file
			File userFile = new File(OurUtility.canvasPath);
			FileWriter writer = new FileWriter(userFile, false);
			writer.write(data);
            writer.close();
			
            //hold the user data
            userFileList.put(fileName, data);
            
            REXP expResult = null;
            if(mag == null){
            	expResult = c.eval( functionName + "()");
            }else{
            	c.assign("mag", mag);
            	expResult = c.eval( functionName + "('"+mag+"')");
            };
			result = new ArrayList<String>();
			if(expResult.isNumeric()){
				for(double db : expResult.asDoubles()){
					result.add(""+ db);
				}
			}else if(expResult.isString()){
				for(String db : expResult.asStrings()){
					result.add(db);
				}
			};
			
			c.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (c != null) {
				try {
					c.close();

				} finally {
				}
			}
		}
	}
	
	public ArrayList<String> getResults(){
		return result;
	}
}
