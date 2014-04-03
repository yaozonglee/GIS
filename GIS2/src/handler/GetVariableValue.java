package handler;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.rosuda.REngine.REXP;
import org.rosuda.REngine.RList;
import org.rosuda.REngine.Rserve.RConnection;

/**
 * Servlet implementation class GetVariableValue
 */
@WebServlet("/GetVariableValue")
public class GetVariableValue extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetVariableValue() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String points = request.getParameter("userPoints");
		String[] point = points.split(",");
		String amenityPath = OurUtility.amenityPath;
		ArrayList<Double> result = new ArrayList<Double>();
		RConnection c = null;
		try {
			c = new RConnection();
			c.eval("source(\""+OurUtility.RScriptPath+"\")");

			
            for(String xLine : GetRegressionResult.regressionInput){
            	String query = "";
    			String[] xLineVals = xLine.split(",");
    			String amenityFullPath = amenityPath + xLineVals[0] + ".csv";
    			query += (point[0] + "," + point[1] + "," +amenityFullPath + "," + xLineVals[1] + "," + xLineVals[2] + "," + xLineVals[0]);
    			c.assign("str", query);
    			REXP varVal = c.eval("postCalculation(str)");
    			System.out.println(varVal.toDebugString());
    			result.add(varVal.asDouble());
    		}
            
            String[] userInput = GetRegressionResult.regressionInput;
            JSONArray arr = new JSONArray();
            double[][] coeff = GetRegressionResult.numericVals;
            String display = "" + coeff[0][0] + " + ";
            double sum = 0.0;
            for(int i = 1; i < coeff.length; i++){
            	String[] tempVar = userInput[i-1].split(",");
            	String tempOutput = tempVar[0] + "(" + tempVar[1] + ")" + ": " + result.get(i - 1);
            	arr.put(tempOutput);
            	sum += (coeff[i][0] * result.get(i - 1));
            	display += ("(" + coeff[i][0] + ")(" + result.get(i - 1) + ")");
            	if(i != (coeff.length - 1)){
            		display += " + ";
            	}
            }
            display += (" = " + sum);
            System.out.println("display: " + display);
            
            System.out.println("Popup: " + arr.toString());
            JSONObject finalResult = new JSONObject();
            finalResult.put("popUp", arr.toString());
            finalResult.put("fullEqn", display);
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
