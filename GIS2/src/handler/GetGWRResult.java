package handler;

import java.io.IOException;

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
 * Servlet implementation class GetGWRResult
 */
@WebServlet("/GetGWRResult")
public class GetGWRResult extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public GetGWRResult() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		String regData = request.getParameter("regData");
		String targetPath = OurUtility.targetPath;
		String targetMag = FileResult.targetMag;
		String amenityPath = OurUtility.amenityPath;
		String[] userInput = regData.split("~");
		
		String preparedInput = targetPath + "," + targetMag + "~";
		for (String xLine : userInput) {
			String[] xLineVals = xLine.split(",");
			String amenityFullPath = amenityPath + xLineVals[0] + ".csv";
			preparedInput += (amenityFullPath + "," + xLineVals[1] + ","
					+ xLineVals[2] + "," + xLineVals[0] + "~");
		}
		System.out.println("GWR: " + preparedInput);

		RConnection c = null;
		try {
			c = new RConnection();
			c.eval("source(\"" + OurUtility.RScriptPath + "\")");

			c.assign("str", preparedInput);
			REXP gwrResult = c.eval("GWRcomputation(str)");
//			System.out.println(gwrResult.toDebugString());
//			System.out.println(gwrResult.getAttribute("names"));
			String[] names = gwrResult.getAttribute("names").asStrings();
//			for(String x: names){
//				System.out.println("names: " + x);
//			}
//			System.out.println(gwrResult.asList());
			RList vals = gwrResult.asList();
//			for(int i = 0; i < vals.size(); i++){
//				REXP valREXP = (REXP) vals.get(i);
//				double[] colVal = valREXP.asDoubles();
//				for(double x: colVal){
//					System.out.println(i + ":    " + x);
//				}
//			}
			
			JSONObject finalResult = new JSONObject();
			for(int i = 0; i < names.length; i++){
				REXP valREXP = (REXP) vals.get(i);
				double[] colVal = valREXP.asDoubles();
				JSONArray jColVals = new JSONArray(colVal);
				finalResult.put(names[i], jColVals);
			}
			System.out.println(finalResult.toString());
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
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
