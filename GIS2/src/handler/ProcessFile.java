package handler;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet implementation class ProcessFile
 */
@WebServlet("/ProcessFile")
public class ProcessFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ProcessFile() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//HashMap<String, String> finalResult = new HashMap<String, String>();
		JSONArray finalResult = new JSONArray();
		String csv = request.getParameter("meh");
		String mag = request.getParameter("mag");
		String fileName = request.getParameter("fileName");
		String fileType = request.getParameter("fileType");
		
		//write to file
		String filePath = "/Users/yaozong/git/GIS/GIS2/WebContent/WEB-INF/";
		File userFile = new File(filePath + fileName + ".csv");
		if(!userFile.exists()){
			userFile.createNewFile();
		}
		FileWriter writer = new FileWriter(userFile, false);
		writer.write(csv);
        writer.close();
		
        //write to target file
        if(fileType.equals("target")){
        	writer = new FileWriter(filePath + "target.csv", false);
    		writer.write(csv);
            writer.close();
            FileResult.targetMag = mag;
        }
        
		FileResult result = null;
		if(mag.equals("0")){
			result = new FileResult(csv, "Quadrat", null, fileName);
		}else{
			result = new FileResult(csv, "MoranMagnitude", mag, fileName);
		}
		JSONArray arr = null;
		ArrayList<String> statScore = result.getResults();
		for(int i = 0; i < statScore.size(); i++){
			arr = new JSONArray();
			if(i == 0){
				arr.put("position 0");
			}else if(i == 1){
				arr.put("position 1");
			}
			arr.put(statScore.get(i));
			finalResult.put(arr);
		}
		response.getWriter().write(finalResult.toString());
	}

}
