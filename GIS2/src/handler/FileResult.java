package handler;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;

import org.rosuda.REngine.REXP;
import org.rosuda.REngine.Rserve.RConnection;

public class FileResult {
	
	ArrayList<String> result;
	
	public FileResult(String data, String functionName, String mag){
		RConnection c = null;
		try {
			c = new RConnection();
			c.eval("source(\"/Users/yaozong/Documents/workspace/GIS2/WebContent/WEB-INF/RScripts/Palindrome.R\")");

			// write to temp file
			File userFile = new File("/Users/yaozong/Documents/workspace/GIS2/WebContent/WEB-INF/canvas.csv");
			FileWriter writer = new FileWriter(userFile, false);
			writer.write(data);
            writer.close();
			
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
