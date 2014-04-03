package handler;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.rosuda.REngine.REXP;
import org.rosuda.REngine.REXPList;
import org.rosuda.REngine.RFactor;
import org.rosuda.REngine.RList;
import org.rosuda.REngine.Rserve.RConnection;

/**
 * Servlet implementation class GetRegressionResult
 */
@WebServlet("/GetRegressionResult")
public class GetRegressionResult extends HttpServlet {
	private static final long serialVersionUID = 1L;
    public static String[] regressionInput;
    public static double[][] numericVals;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetRegressionResult() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String regData = request.getParameter("regData");
		String targetPath = OurUtility.targetPath;
		String targetMag = FileResult.targetMag;
		String amenityPath = OurUtility.amenityPath;
		String[] userInput = regData.split("~");
		regressionInput = userInput;
		String preparedInput = targetPath + "," + targetMag + "~";
		for(String xLine : userInput){
			String[] xLineVals = xLine.split(",");
			String amenityFullPath = amenityPath + xLineVals[0] + ".csv";
			preparedInput += (amenityFullPath + "," + xLineVals[1] + "," + xLineVals[2] + "," + xLineVals[0] + "~");
		}
		System.out.println(preparedInput);
		
		RConnection c = null;
		try {
			c = new RConnection();
			c.eval("source(\""+OurUtility.RScriptPath+"\")");

			c.assign("str", preparedInput);
            REXP is_abc_palindrome = c.eval("computation(str)");
            REXP secondCall = c.eval("Rcomputation(str)");
            double second = secondCall.asDouble();
            numericVals = is_abc_palindrome.asDoubleMatrix();
            RList dimNames = is_abc_palindrome.getAttribute("dimnames").asList();
            System.out.println("Being header names");
            JSONArray headerVals = new JSONArray();
            for(int i = 0; i < dimNames.size(); i ++){
            	REXP val = (REXP) dimNames.get(i);
            	String[] valValues = val.asStrings();
            	JSONArray currentArrVals = new JSONArray(valValues);
            	headerVals.put(currentArrVals);
            	System.out.println("Row: " + i);
            	for(int j = 0; j < valValues.length; j++){
            		System.out.print(valValues[j] + "  ");
            	}
            	System.out.println();
            }
            System.out.println("header values json: " + headerVals.toString());
            
            
            JSONArray statsVals = new JSONArray();
            System.out.println("Being Print values");
            for(int i = 0; i < numericVals.length; i++){
            	JSONArray currentArrVals = new JSONArray(numericVals[i]);
            	statsVals.put(currentArrVals);
            	for(int j = 0; j < numericVals[i].length; j++){
            		System.out.print(numericVals[i][j] + "  ");
            	}
            	System.out.println();
            }
            System.out.println("stats values json: " + statsVals.toString());
            System.out.println("Rows: " + numericVals.length + " Cols: " + numericVals[0].length);
            
            JSONObject finalResult = new JSONObject();
            finalResult.put("headerVals", headerVals);
            finalResult.put("statsVals", statsVals);
            finalResult.put("secondCall", second);
            response.getWriter().write(finalResult.toString());
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

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
