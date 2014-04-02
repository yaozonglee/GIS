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
            double[][] lo = is_abc_palindrome.asDoubleMatrix();
            System.out.println("DEBUG STRING: " + is_abc_palindrome.toDebugString());
            RList dimNames = is_abc_palindrome.getAttribute("dimnames").asList();
//            Iterator iter = dimNames.iterator();
            for(int i = 0; i < dimNames.size(); i ++){
            	REXP val = (REXP) dimNames.get(i);
            	String[] valValues = val.asStrings();
            	for(int j = 0; j < valValues.length; j++){
            		System.out.println("Outer: " + i + " Inner: " + valValues[j]);
            	}
            }
            
//            while(iter.hasNext()){
//            	REXP val = (REXP) iter.next();
//            	System.out.println("iter: " + iter.next() + "size: " + dimNames.size());
//            	String[] values = val.asStrings();
//            	for(int i = 0; i < values.length; i++){
//            		System.out.println("values " + i + " " +values[i]);
//            	}
//            }
            
            
            int[] dimArr = is_abc_palindrome.dim();
            for(int x: dimArr){
            	System.out.println("dimArr: " + x);
            }
            String[] a = is_abc_palindrome.asStrings();
            for(String x: a){
            	System.out.println("Str: " + x);
            }
            System.out.println(lo.toString());
            
            
			
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
